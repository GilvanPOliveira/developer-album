import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getAppMode, getSupabaseConfigError } from '../../config/app-mode'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

let supabase: SupabaseClient | null = null

function createSupabase(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export function getSupabaseClient(): SupabaseClient {
  if (getAppMode() === 'demo') {
    throw new Error('Supabase indisponível no modo demo.')
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(getSupabaseConfigError())
  }

  if (!supabase) {
    supabase = createSupabase()
  }

  return supabase
}

export function hasSupabaseClient(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
