import { createClient } from "@supabase/supabase-js";

// Supabase client singleton for Storage API access
// Used for uploading ad images to Supabase Storage buckets
// Server-side: uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS — ownership validated via Prisma)
// Fallback: NEXT_PUBLIC_SUPABASE_ANON_KEY (requires correct RLS policies)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxxplaceholderxxx.supabase.co";
const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn(
    "⚠️  Missing NEXT_PUBLIC_SUPABASE_URL. Storage features will not work. " +
    "Please add it to .env.local"
  );
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️  Missing SUPABASE_SERVICE_ROLE_KEY — falling back to anon key. " +
    "Add SUPABASE_SERVICE_ROLE_KEY to .env.local for production."
  );
}

// Create Supabase client for Storage API
export const supabase = createClient(supabaseUrl, supabaseKey);
