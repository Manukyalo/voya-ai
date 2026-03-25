import { createClient } from '@supabase/supabase-js'

/**
 * Creates an authenticated Supabase client using the Clerk session token.
 * This ensures that Supabase RLS (Row Level Security) filters data by lodge_id automatically.
 * 
 * @param getToken - The getToken function from useAuth() (Client Component) or auth().getToken() (Server Component)
 */
export const getSupabaseClient = async (getToken: (options: { template: string }) => Promise<string | null>) => {
  const token = await getToken({ template: 'supabase' })
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      global: { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      } 
    }
  )
}
