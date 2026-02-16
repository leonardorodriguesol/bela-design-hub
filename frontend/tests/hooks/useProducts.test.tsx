import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { productsApi } from '../../src/api/products'
import { useProducts } from '../../src/hooks/useProducts'
import { createQueryClientWrapper } from '../test-utils'

describe('useProducts', () => {
  const wrapper = createQueryClientWrapper().Wrapper

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the list of products', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Produto 1',
        description: 'Desc',
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: null,
        parts: [{ id: 'p1', name: 'Peça', quantity: 2 }],
      },
    ]

    vi.spyOn(productsApi, 'list').mockResolvedValueOnce(mockProducts)

    const { result } = renderHook(() => useProducts(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockProducts)
    expect(productsApi.list).toHaveBeenCalledTimes(1)
  })

  it('exposes error state when listing fails', async () => {
    const error = new Error('Network error')
    vi.spyOn(productsApi, 'list').mockRejectedValueOnce(error)

    const { result } = renderHook(() => useProducts(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBe(error)
  })
})
