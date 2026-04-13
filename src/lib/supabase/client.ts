import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isDemoMode, isSupabaseMode } from '../../config/app-mode'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

function createSupabase(): SupabaseClient | null {
  if (isDemoMode) {
    return null
  }

  if (isSupabaseMode && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar VITE_APP_MODE=supabase.',
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export const supabase = createSupabase()

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase indisponível no modo demo.')
  }

  return supabase
}

export const hasSupabaseClient = Boolean(supabase)
