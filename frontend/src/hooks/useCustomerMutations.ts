import { useMutation, useQueryClient } from '@tanstack/react-query'

import { customersApi } from '../api/customers'
import type { CreateCustomerInput, UpdateCustomerInput } from '../types/customer'

export const useCustomerMutations = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (payload: CreateCustomerInput) => customersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerInput }) =>
      customersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  return { create, update, remove }
}
