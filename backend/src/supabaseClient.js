import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load local env values (does nothing in production if process.env already set)
dotenv.config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase env vars missing. Set REACT_APP_SUPABASE_URL and REACT_APP_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
