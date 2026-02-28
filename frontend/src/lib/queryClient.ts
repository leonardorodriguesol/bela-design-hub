import { QueryClient } from '@tanstack/react-query'
import { isHttpClientError } from './httpClient'

const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= 2) {
    return false
  }

  if (isHttpClientError(error) && error.status && error.status >= 400 && error.status < 500) {
    return false
  }

  return true
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
