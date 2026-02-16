import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data)
      return Promise.reject(error)
    }

    console.error('Network error:', error.message)
    const connectionError = new Error(
      'Não foi possível acessar o backend. Certifique-se de que a API está em execução.'
    )
    connectionError.name = 'BackendConnectionError'
    return Promise.reject(connectionError)
  },
)
