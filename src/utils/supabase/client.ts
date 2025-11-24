import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client for frontend use
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey);
  }
  return supabaseClient;
}

export const supabase = createClient();
