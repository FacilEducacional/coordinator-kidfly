import { createClient } from "@supabase/supabase-js";

export var initialHash = typeof window !== "undefined" ? window.location.hash : "";
export var initialSearch = typeof window !== "undefined" ? window.location.search : "";

export var supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
