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

    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: "Could not verify caller identity." }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerAdminRow } = await adminClient
      .from("admin_users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (!callerAdminRow || callerAdminRow.role !== "master") {
      return json({ error: "Only a master admin can remove admin accounts." }, 403);
    }

    const { id } = await req.json();
    if (!id) return json({ error: "Missing admin id to delete." }, 400);

    if (id === userData.user.id) {
      return json({ error: "You can't remove your own admin account." }, 400);
    }

    // Remove console access first...
    const { error: deleteRowError } = await adminClient.from("admin_users").delete().eq("id", id);
    if (deleteRowError) return json({ error: deleteRowError.message }, 400);

    // ...then remove the actual login account so it can't sign in at all anymore.
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(id);
    if (deleteAuthError) {
      return json({ error: `Admin access removed, but deleting the login failed: ${deleteAuthError.message}` }, 207);
    }

    return json({ success: true });
  } catch (err) {
    return json({ error: "Something went wrong. Try again." }, 500);
  }
});