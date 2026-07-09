// ═══════════════════════════════════════════════════════════════
// Hirevix Supabase Client Configuration
// ═══════════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function createSupabaseClient(url: string, key: string): SupabaseClient | null {
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  });
}

// Standard client for browser-side and general server-side auth operations
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Admin client for bypass operations (e.g. server-side user registration creation)
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey) ?? supabase;
