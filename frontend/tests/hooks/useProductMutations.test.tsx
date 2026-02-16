import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { productsApi } from '../../src/api/products'
import { useProductMutations } from '../../src/hooks/useProductMutations'
import type { CreateProductInput } from '../../src/types/product'
import { createQueryClientWrapper } from '../test-utils'

describe('useProductMutations', () => {
  const createPayload: CreateProductInput = {
    name: 'Novo produto',
    description: 'Desc',
    parts: [{ name: 'Peça', quantity: 2 }],
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a product and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(productsApi, 'create').mockResolvedValueOnce({
      id: '1',
      ...createPayload,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: null,
      parts: [{ id: 'part', name: 'Peça', quantity: 2 }],
    })

    const { result } = renderHook(() => useProductMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.create.mutateAsync(createPayload)
    })

    expect(productsApi.create).toHaveBeenCalledWith(createPayload)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['products'] })
  })

  it('updates a product and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(productsApi, 'update').mockResolvedValueOnce({
      id: '1',
      ...createPayload,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-02T00:00:00.000Z',
      parts: [{ id: 'part', name: 'Peça', quantity: 2 }],
    })

    const { result } = renderHook(() => useProductMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.update.mutateAsync({ id: '1', payload: createPayload })
    })

    expect(productsApi.update).toHaveBeenCalledWith('1', createPayload)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['products'] })
  })

  it('removes a product and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(productsApi, 'remove').mockResolvedValueOnce('1')

    const { result } = renderHook(() => useProductMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.remove.mutateAsync('1')
    })

    expect(productsApi.remove).toHaveBeenCalledWith('1')
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['products'] })
  })
})
