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
    const { phone, pin } = await req.json();
    if (!phone || !pin) {
      return json({ valid: false, error: "Phone and PIN are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Elevated client — this is the ONLY way to read pin_hash before the
    // user has a session, since RLS correctly blocks anonymous reads.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error } = await adminClient
      .from("profiles")
      .select("id, pin_hash, status")
      .eq("phone", phone)
      .single();

    if (error || !profile) {
      return json({ valid: false, error: "No account found for this phone number." }, 404);
    }
    if (profile.status === "suspended") {
      return json({ valid: false, error: "This account has been suspended." }, 403);
    }

    const pinMatches = await bcrypt.compare(pin, profile.pin_hash);
    if (!pinMatches) {
      return json({ valid: false, error: "Incorrect PIN." }, 401);
    }

    return json({ valid: true });
  } catch (err) {
    return json({ valid: false, error: "Something went wrong. Try again." }, 500);
  }
});