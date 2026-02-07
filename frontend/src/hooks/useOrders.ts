import { useQuery } from '@tanstack/react-query'

import { ordersApi } from '../api/orders'

export const useOrders = (filters?: {
  customerId?: string
  status?: string
  createdFrom?: string
  createdTo?: string
}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.list(filters),
  })
}
