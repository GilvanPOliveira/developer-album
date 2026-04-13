export const APP_MODES = ['demo', 'supabase'] as const

export type AppMode = (typeof APP_MODES)[number]

const DEFAULT_APP_MODE: AppMode = 'supabase'

function normalizeAppMode(value: unknown): AppMode {
  if (typeof value !== 'string') {
    return DEFAULT_APP_MODE
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'demo' || normalized === 'supabase') {
    return normalized
  }

  return DEFAULT_APP_MODE
}

export const appMode: AppMode = normalizeAppMode(import.meta.env.VITE_APP_MODE)

export const isDemoMode = appMode === 'demo'
export const isSupabaseMode = appMode === 'supabase'

export function assertSupabaseMode(message?: string): void {
  if (!isSupabaseMode) {
    throw new Error(message ?? 'Esta operação só está disponível quando VITE_APP_MODE=supabase.')
  }
}

export function assertDemoMode(message?: string): void {
  if (!isDemoMode) {
    throw new Error(message ?? 'Esta operação só está disponível quando VITE_APP_MODE=demo.')
  }
}
