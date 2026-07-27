import { Webhook } from "npm:standardwebhooks@1";

Deno.serve(async (req) => {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    const secret = Deno.env.get("SEND_SMS_HOOK_SECRET")!.replace("v1,whsec_", "");
    const wh = new Webhook(secret);

    // Verifies this request genuinely came from Supabase Auth, not
    // someone else hitting this URL directly.
    const { user, sms } = wh.verify(payload, headers) as {
      user: { phone: string };
      sms: { otp: string };
    };

    const deviceId = Deno.env.get("TEXTBEE_DEVICE_ID")!;
    const apiKey = Deno.env.get("TEXTBEE_API_KEY")!;

    const message = `Your SHP verification code is: ${sms.otp}`;

    const response = await fetch(
      `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          recipients: [user.phone.startsWith("+") ? user.phone : `+${user.phone}`],
          message,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Textbee send failed:", errText);
      return new Response(
        JSON.stringify({ error: { http_code: 500, message: "Failed to send SMS." } }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Supabase's Send SMS Hook expects an empty success body.
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sms-hook error:", err);
    return new Response(
      JSON.stringify({ error: { http_code: 500, message: "Something went wrong." } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});