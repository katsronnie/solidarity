import { createClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing Authorization header." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Identify the caller — they must already have a valid session from
    // having just verified their phone OTP (signup step 2).
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: "Could not verify caller identity." }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Don't let someone "register" twice.
    const { data: existing } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", userData.user.id)
      .single();
    if (existing) return json({ error: "This account is already registered." }, 400);

    const { name, network, pin } = await req.json();
    if (!name || !network || !pin) {
      return json({ error: "Name, network, and PIN are required." }, 400);
    }
    if (!["mtn", "airtel"].includes(network)) {
      return json({ error: "Network must be mtn or airtel." }, 400);
    }
    const expectedLength = network === "mtn" ? 5 : 4;
    if (!new RegExp(`^\\d{${expectedLength}}$`).test(pin)) {
      return json({ error: `${network.toUpperCase()} PIN must be exactly ${expectedLength} digits.` }, 400);
    }

    const phone = userData.user.phone;
    if (!phone) return json({ error: "No verified phone number found on this account." }, 400);

    const pinHash = await bcrypt.hash(pin, 10);

    const { error: insertError } = await adminClient.from("profiles").insert({
      id: userData.user.id,
      name,
      phone,
      network,
      pin_hash: pinHash,
      balance: 0,
      status: "active",
    });

    if (insertError) return json({ error: insertError.message }, 400);

    return json({ success: true });
  } catch (err) {
    return json({ error: "Something went wrong. Try again." }, 500);
  }
});