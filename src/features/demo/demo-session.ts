import { findDemoUserById, type DemoAuthUserRecord } from './demo-data'

export type DemoSessionUser = {
  id: string
  email: string
}

export type DemoSession = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: DemoSessionUser
}

type DemoSessionListener = (session: DemoSession | null) => void

const DEMO_SESSION_STORAGE_KEY = 'developer-album:demo-session'
const DEMO_SESSION_EVENT_NAME = 'developer-album:demo-session-changed'

const listeners = new Set<DemoSessionListener>()

function safeWindow(): Window | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window
}

function notifyListeners(session: DemoSession | null): void {
  for (const listener of listeners) {
    listener(session)
  }

  const currentWindow = safeWindow()

  currentWindow?.dispatchEvent(
    new CustomEvent<DemoSession | null>(DEMO_SESSION_EVENT_NAME, {
      detail: session,
    }),
  )
}

export function buildDemoSession(user: DemoAuthUserRecord): DemoSession {
  const now = Date.now()

  return {
    accessToken: `demo-access-token-${user.id}-${now}`,
    refreshToken: `demo-refresh-token-${user.id}-${now}`,
    expiresAt: now + 1000 * 60 * 60 * 24 * 7,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}

export function getDemoSession(): DemoSession | null {
  const currentWindow = safeWindow()

  if (!currentWindow) {
    return null
  }

  const raw = currentWindow.localStorage.getItem(DEMO_SESSION_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as DemoSession

    if (!parsed?.user?.id || !parsed?.user?.email || !parsed?.accessToken) {
      currentWindow.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY)
      return null
    }

    if (parsed.expiresAt <= Date.now()) {
      currentWindow.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    currentWindow.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY)
    return null
  }
}

export function setDemoSession(session: DemoSession): DemoSession {
  const currentWindow = safeWindow()

  if (currentWindow) {
    currentWindow.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  notifyListeners(session)
  return session
}

export function clearDemoSession(): void {
  const currentWindow = safeWindow()
  currentWindow?.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY)
  notifyListeners(null)
}

export function subscribeDemoSession(listener: DemoSessionListener): () => void {
  listeners.add(listener)

  const currentWindow = safeWindow()

  const onStorage = (event: StorageEvent) => {
    if (event.key !== DEMO_SESSION_STORAGE_KEY) {
      return
    }

    listener(getDemoSession())
  }

  const onCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<DemoSession | null>
    listener(customEvent.detail ?? null)
  }

  currentWindow?.addEventListener('storage', onStorage)
  currentWindow?.addEventListener(DEMO_SESSION_EVENT_NAME, onCustomEvent)

  return () => {
    listeners.delete(listener)
    currentWindow?.removeEventListener('storage', onStorage)
    currentWindow?.removeEventListener(DEMO_SESSION_EVENT_NAME, onCustomEvent)
  }
}

export function getDemoSessionUser(): DemoAuthUserRecord | null {
  const session = getDemoSession()

  if (!session) {
    return null
  }

  return findDemoUserById(session.user.id)
}
