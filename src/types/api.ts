export type ApiResult<T> = {
  data: T | null
  error: string | null
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export type AppError = {
  message: string
}
