import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { productionSchedulesApi } from '../../src/api/products'
import { useProductionScheduleMutations } from '../../src/hooks/useProductionScheduleMutations'
import type { CreateProductionScheduleInput, UpdateProductionStatusInput } from '../../src/types/product'
import { createQueryClientWrapper } from '../test-utils'

describe('useProductionScheduleMutations', () => {
  const createPayload: CreateProductionScheduleInput = {
    productId: 'prod-1',
    scheduledDate: '2024-02-20',
    quantity: 2,
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a schedule and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(productionSchedulesApi, 'create').mockResolvedValueOnce({
      id: 'sched-1',
      productId: createPayload.productId,
      scheduledDate: createPayload.scheduledDate,
      quantity: createPayload.quantity,
      status: 'Planned',
      createdAt: '2024-02-10',
      updatedAt: null,
      product: undefined,
      parts: [],
    })

    const { result } = renderHook(() => useProductionScheduleMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.create.mutateAsync(createPayload)
    })

    expect(productionSchedulesApi.create).toHaveBeenCalledWith(createPayload)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['production-schedules'] })
  })

  it('updates status and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const payload: UpdateProductionStatusInput = { status: 'InProgress' }
    vi.spyOn(productionSchedulesApi, 'updateStatus').mockResolvedValueOnce({
      id: 'sched-1',
      productId: createPayload.productId,
      scheduledDate: createPayload.scheduledDate,
      quantity: createPayload.quantity,
      status: 'InProgress',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-15',
      product: undefined,
      parts: [],
    })

    const { result } = renderHook(() => useProductionScheduleMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.updateStatus.mutateAsync({ id: 'sched-1', payload })
    })

    expect(productionSchedulesApi.updateStatus).toHaveBeenCalledWith('sched-1', payload)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['production-schedules'] })
  })

  it('removes and invalidates cache', async () => {
    const { queryClient, Wrapper } = createQueryClientWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    vi.spyOn(productionSchedulesApi, 'remove').mockResolvedValueOnce('sched-1')

    const { result } = renderHook(() => useProductionScheduleMutations(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.remove.mutateAsync('sched-1')
    })

    expect(productionSchedulesApi.remove).toHaveBeenCalledWith('sched-1')
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['production-schedules'] })
  })
})
