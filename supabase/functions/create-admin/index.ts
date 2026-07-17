import { createClient } from "npm:@supabase/supabase-js@2";

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
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client scoped to the CALLER's own token — used only to figure out who's calling.
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: "Could not verify caller identity." }, 401);
    }

    // Elevated client — only used server-side, never exposed to the browser.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Confirm the CALLER is a master admin before doing anything else.
    const { data: callerAdminRow } = await adminClient
      .from("admin_users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (!callerAdminRow || callerAdminRow.role !== "master") {
      return json({ error: "Only a master admin can add new admin accounts." }, 403);
    }

    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return json({ error: "Email, password, and name are required." }, 400);
    }
    if (password.length < 6) {
      return json({ error: "Password must be at least 6 characters." }, 400);
    }
    if (role && !["master", "staff"].includes(role)) {
      return json({ error: "Role must be 'master' or 'staff'." }, 400);
    }

    // Create the actual login account.
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email confirmation step for admin-created accounts
    });

    if (createError || !newUser?.user) {
      return json({ error: createError?.message || "Could not create the account." }, 400);
    }

    // Grant them admin access.
    const { error: insertError } = await adminClient.from("admin_users").insert({
      id: newUser.user.id,
      email,
      name,
      role: role || "staff",
    });

    if (insertError) {
      // Roll back the auth user if we couldn't grant admin access, so we
      // don't end up with an orphaned login that has no admin row.
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return json({ error: insertError.message }, 400);
    }

    return json({ success: true, id: newUser.user.id });
  } catch (err) {
    return json({ error: "Something went wrong. Try again." }, 500);
  }
});