import axios, { isAxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const backendUnavailableMessage =
  'Não foi possível acessar o backend. Certifique-se de que a API está em execução.'

export type HttpErrorType = 'api' | 'network' | 'unknown'

export interface HttpClientError extends Error {
  type: HttpErrorType
  status?: number
  details?: unknown
}

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const logError = (message: string, details: unknown) => {
  if (import.meta.env.DEV) {
    console.error(message, details)
  }
}

const getErrorMessageFromPayload = (payload: unknown): string | undefined => {
  if (typeof payload === 'string') return payload
  if (!payload || typeof payload !== 'object') return undefined

  if ('message' in payload && typeof (payload as { message?: string }).message === 'string') {
    return (payload as { message: string }).message
  }

  if ('errors' in payload && payload.errors && typeof payload.errors === 'object') {
    const errorsObj = payload.errors as Record<string, string | string[]>
    const firstKey = Object.keys(errorsObj)[0]

    if (firstKey) {
      const value = errorsObj[firstKey]
      if (Array.isArray(value)) return value[0]
      if (typeof value === 'string') return value
    }
  }

  if ('title' in payload && typeof (payload as { title?: string }).title === 'string') {
    return (payload as { title: string }).title
  }

  return undefined
}

const createHttpError = (params: {
  message: string
  type: HttpErrorType
  status?: number
  details?: unknown
  name?: string
}): HttpClientError => {
  const error = new Error(params.message) as HttpClientError
  error.name = params.name ?? 'HttpClientError'
  error.type = params.type
  error.status = params.status
  error.details = params.details
  return error
}

export const isHttpClientError = (error: unknown): error is HttpClientError => {
  if (!(error instanceof Error)) return false
  if (!('type' in error)) return false

  const typedError = error as { type?: unknown }
  return typedError.type === 'api' || typedError.type === 'network' || typedError.type === 'unknown'
}

export const getHttpErrorMessage = (error: unknown, fallback: string): string => {
  if (isHttpClientError(error)) {
    return error.message || fallback
  }

  if (isAxiosError(error)) {
    const payloadMessage = getErrorMessageFromPayload(error.response?.data)
    return payloadMessage ?? error.message ?? fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status
      const payload = error.response.data
      const message = getErrorMessageFromPayload(payload) ?? `Erro na API (${status}).`

      logError('API error:', { status, payload })
      return Promise.reject(
        createHttpError({
          message,
          type: 'api',
          status,
          details: payload,
          name: 'ApiHttpError',
        }),
      )
    }

    if (isAxiosError(error) && error.request) {
      logError('Network error:', error.message)
      return Promise.reject(
        createHttpError({
          message: backendUnavailableMessage,
          type: 'network',
          details: error.message,
          name: 'BackendConnectionError',
        }),
      )
    }

    logError('Unexpected HTTP client error:', error)
    return Promise.reject(
      createHttpError({
        message: 'Ocorreu um erro inesperado ao comunicar com a API.',
        type: 'unknown',
        details: error,
      }),
    )
  },
)
