import { createClient } from "@supabase/supabase-js";

// Supabase client singleton for Storage API access
// Used for uploading ad images to Supabase Storage buckets

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxxplaceholderxxx.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️  Missing Supabase environment variables. Storage features will not work. " +
    "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

// Create Supabase client for Storage API
export const supabase = createClient(supabaseUrl, supabaseKey);
