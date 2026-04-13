import type { RequestStatus } from './api'

export type SelectOption = {
  label: string
  value: string
}

export type NavItem = {
  label: string
  to: string
}

export type AsyncState = {
  status: RequestStatus
  message: string | null
}
