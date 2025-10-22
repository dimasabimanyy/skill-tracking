import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a null client if no environment variables are provided
// This allows the app to work with mock data
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClientComponentClient();
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
  }
}

// For components that need the client
export const createSupabaseClient = () => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClientComponentClient();
  }
  return null;
};

export { supabase };