import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // This fires if .env is missing or Vite wasn't restarted after adding it.
  console.error(
    "Missing Supabase env vars. Check .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart `npm run dev`."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
