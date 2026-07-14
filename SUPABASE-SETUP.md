# Supabase connection — setup steps

## 1. Install the client library

```bash
npm install @supabase/supabase-js
```

## 2. Add these two files to your project

- `.env` → project root (same level as `package.json`)
- `src/lib/supabaseClient.js` → into `src/lib/`

**Important:** I used your **Project URL** (`https://yusilugapgosinzdmwrj.supabase.co`),
not the `/rest/v1/` address you pasted — that `/rest/v1/` suffix is the raw REST
API path, but the JS client library wants the bare project URL and adds the
right paths itself internally. Using the `/rest/v1/` one directly would have
caused confusing errors, so this is now handled correctly.

## 3. Add `.env` to `.gitignore`

Open `.gitignore` in your project root and make sure it has a line:
```
.env
```
This isn't because the anon key is secret (it isn't) — it's just good habit,
since you'll likely add real secret keys to `.env` later (like a `service_role`
key for admin-only server code) and you don't want those accidentally committed.

## 4. Restart your dev server

Vite only reads `.env` on startup, not live:
```bash
npm run dev
```

## 5. Quick test — confirm the connection actually works

Temporarily add this to the top of any page component (e.g. `ShpDashboard.jsx`),
right after the imports, then check your browser console:

```js
import { supabase } from "./lib/supabaseClient";

// TEMPORARY — remove after confirming this logs data, not an error
supabase.from("hospitals").select("*").then(({ data, error }) => {
  console.log("Supabase test:", { data, error });
});
```

- If you see `data: []` (empty array) and `error: null` → **it's connected**,
  the `hospitals` table is just empty (that's expected, we haven't inserted
  any hospitals yet).
- If you see an error instead, paste it here and I'll debug it with you.

Remove that test snippet once confirmed — it was just to prove the wiring works.

## What's next

Once this connection test passes, the next piece is writing the actual
**Edge Functions** — small server-side functions hosted by Supabase that:
1. Check a user's PIN against the hashed value in `profiles`, then trigger
   the SMS OTP if it matches
2. Handle the admin email+password login, then generate/send/verify the
   email OTP second step

That requires installing the Supabase CLI locally to write and deploy those
functions — it's a bit more setup, but each function is short. Ready to do
that next, or want to confirm this connection works first?
