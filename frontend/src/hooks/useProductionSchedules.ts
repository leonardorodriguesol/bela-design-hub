import { useQuery } from '@tanstack/react-query'

import { productionSchedulesApi } from '../api/products'

export const useProductionSchedules = (filters?: {
  scheduledDate?: string
  startDate?: string
  endDate?: string
  status?: string
}) => {
  return useQuery({
    queryKey: ['production-schedules', filters],
    queryFn: () => productionSchedulesApi.list(filters),
  })
}
