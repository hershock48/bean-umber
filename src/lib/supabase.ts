/**
 * Supabase client configuration
 * Server-side client using service role key for full database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env';

// Singleton instance
let supabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton)
 * Uses service role key for server-side operations
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Get a fresh Supabase client (useful for testing or isolated operations)
 */
export function createSupabaseClient(): SupabaseClient {
  const config = getSupabaseConfig();
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Export types for convenience
export type { SupabaseClient };
