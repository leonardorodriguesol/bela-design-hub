import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productionSchedulesApi } from '../api/products'
import type { CreateProductionScheduleInput, UpdateProductionStatusInput } from '../types/product'

export const useProductionScheduleMutations = () => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['production-schedules'] })
  }

  const create = useMutation({
    mutationFn: (payload: CreateProductionScheduleInput) => productionSchedulesApi.create(payload),
    onSuccess: invalidate,
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductionStatusInput }) =>
      productionSchedulesApi.updateStatus(id, payload),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => productionSchedulesApi.remove(id),
    onSuccess: invalidate,
  })

  return { create, updateStatus, remove }
}
