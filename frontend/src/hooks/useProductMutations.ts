import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productsApi } from '../api/products'
import type { CreateProductInput } from '../types/product'

export const useProductMutations = () => {
  const queryClient = useQueryClient()

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const create = useMutation({
    mutationFn: (payload: CreateProductInput) => productsApi.create(payload),
    onSuccess: invalidateProducts,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateProductInput }) => productsApi.update(id, payload),
    onSuccess: invalidateProducts,
  })

  const remove = useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: invalidateProducts,
  })

  return { create, update, remove }
}
