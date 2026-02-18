import { useQuery } from '@tanstack/react-query'

import { serviceOrdersApi } from '../api/serviceOrders'

export const useServiceOrders = (filters?: {
  customerId?: string
  orderId?: string
  status?: string
  scheduledFrom?: string
  scheduledTo?: string
}) => {
  return useQuery({
    queryKey: ['serviceOrders', filters],
    queryFn: () => serviceOrdersApi.list(filters),
  })
}
