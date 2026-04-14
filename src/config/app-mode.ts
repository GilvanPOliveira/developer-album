import { ref } from 'vue'

export const APP_MODES = ['demo', 'supabase'] as const
export const CONFIGURED_APP_MODES = ['demo', 'supabase', 'both'] as const

export type AppMode = (typeof APP_MODES)[number]
export type ConfiguredAppMode = (typeof CONFIGURED_APP_MODES)[number]

const APP_MODE_STORAGE_KEY = 'developer-album:app-mode'
const DEFAULT_CONFIGURED_APP_MODE: ConfiguredAppMode = 'both'

function normalizeAppMode(value: unknown): AppMode | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'demo' || normalized === 'supabase') {
    return normalized
  }

  return null
}

function normalizeConfiguredAppMode(value: unknown): ConfiguredAppMode {
  if (typeof value !== 'string') {
    return DEFAULT_CONFIGURED_APP_MODE
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'demo' || normalized === 'supabase' || normalized === 'both') {
    return normalized
  }

  return DEFAULT_CONFIGURED_APP_MODE
}

const configuredAppMode = normalizeConfiguredAppMode(import.meta.env.VITE_APP_MODE)
const defaultAppMode = normalizeAppMode(import.meta.env.VITE_DEFAULT_APP_MODE)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export function getConfiguredAppMode(): ConfiguredAppMode {
  return configuredAppMode
}

export function isSupabaseConfigured(): boolean {
  return configuredAppMode !== 'demo' && Boolean(supabaseUrl && supabaseAnonKey)
}

export function getSupabaseConfigError(): string {
  return 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar este modo.'
}

function getDefaultAppMode(): AppMode {
  if (defaultAppMode === 'demo' || defaultAppMode === 'supabase') {
    if (defaultAppMode === 'supabase' && !isSupabaseConfigured()) {
      return 'demo'
    }

    if (defaultAppMode === 'supabase' && configuredAppMode === 'demo') {
      return 'demo'
    }

    if (defaultAppMode === 'demo' && configuredAppMode === 'supabase') {
      return 'supabase'
    }

    return defaultAppMode
  }

  if (configuredAppMode === 'demo') {
    return 'demo'
  }

  if (configuredAppMode === 'supabase') {
    return 'supabase'
  }

  return isSupabaseConfigured() ? 'supabase' : 'demo'
}

function readStoredAppMode(): AppMode | null {
  if (typeof window === 'undefined') {
    return null
  }

  return normalizeAppMode(window.localStorage.getItem(APP_MODE_STORAGE_KEY))
}

function resolveInitialAppMode(): AppMode {
  const storedMode = readStoredAppMode()

  if (storedMode === 'supabase' && !isSupabaseConfigured()) {
    return 'demo'
  }

  if (configuredAppMode === 'demo') {
    return 'demo'
  }

  if (configuredAppMode === 'supabase') {
    return 'supabase'
  }

  return storedMode ?? getDefaultAppMode()
}

export const appModeState = ref<AppMode>(resolveInitialAppMode())

export function getAppMode(): AppMode {
  return appModeState.value
}

export function setAppMode(mode: AppMode): void {
  const resolvedMode = mode === 'supabase' && !isSupabaseConfigured() ? 'demo' : mode

  appModeState.value = resolvedMode

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(APP_MODE_STORAGE_KEY, resolvedMode)
  }
}

export function getAppModeLabel(mode: AppMode = getAppMode()): string {
  return mode === 'demo' ? 'Demo' : 'Supabase'
}

export function isDemoMode(): boolean {
  return getAppMode() === 'demo'
}

export function isSupabaseMode(): boolean {
  return getAppMode() === 'supabase'
}

export function assertSupabaseMode(message?: string): void {
  if (!isSupabaseMode()) {
    throw new Error(message ?? 'Esta operação só está disponível quando o modo ativo é Supabase.')
  }
}

export function assertDemoMode(message?: string): void {
  if (!isDemoMode()) {
    throw new Error(message ?? 'Esta operação só está disponível quando o modo ativo é Demo.')
  }
}

export function listAvailableAppModes() {
  return [
    {
      mode: 'demo' as const,
      label: 'Demo',
      description: 'Explora a plataforma com dados locais no navegador.',
      available: configuredAppMode !== 'supabase',
    },
    {
      mode: 'supabase' as const,
      label: 'Supabase',
      description: isSupabaseConfigured()
        ? 'Usa autenticação e persistência reais no Supabase.'
        : 'Requer variáveis de ambiente do Supabase para funcionar.',
      available: configuredAppMode !== 'demo' && isSupabaseConfigured(),
    },
  ]
}
