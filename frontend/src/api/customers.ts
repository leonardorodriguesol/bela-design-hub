import { httpClient } from '../lib/httpClient'
import type { CreateCustomerInput, Customer, UpdateCustomerInput } from '../types/customer'

export const customersApi = {
  list: async () => {
    const { data } = await httpClient.get<Customer[]>('/api/customers')
    return data
  },
  create: async (payload: CreateCustomerInput) => {
    const { data } = await httpClient.post<Customer>('/api/customers', payload)
    return data
  },
  update: async (id: string, payload: UpdateCustomerInput) => {
    const { data } = await httpClient.put<Customer>(`/api/customers/${id}`, payload)
    return data
  },
  remove: async (id: string) => {
    await httpClient.delete(`/api/customers/${id}`)
    return id
  },
}
