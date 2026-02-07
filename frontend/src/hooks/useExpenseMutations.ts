import { useMutation, useQueryClient } from '@tanstack/react-query'

import { expensesApi } from '../api/expenses'
import type { CreateExpenseInput, UpdateExpenseInput } from '../types/expense'

export const useExpenseMutations = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (payload: CreateExpenseInput) => expensesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseInput }) =>
      expensesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => expensesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  })

  return { create, update, remove }
}
