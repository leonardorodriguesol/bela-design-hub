import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ordersApi } from '../api/orders'
import type { CreateOrderInput, UpdateOrderInput } from '../types/order'

export const useOrderMutations = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (payload: CreateOrderInput) => ordersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderInput }) => ordersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => ordersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  return { create, update, remove }
}
