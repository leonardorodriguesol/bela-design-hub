import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { productionSchedulesApi } from '../../src/api/products'
import { useProductionSchedules } from '../../src/hooks/useProductionSchedules'
import type { ProductionSchedule } from '../../src/types/product'
import { createQueryClientWrapper } from '../test-utils'

const mockSchedule = (overrides?: Partial<ProductionSchedule>): ProductionSchedule => ({
  id: 'sched-1',
  productId: 'prod-1',
  scheduledDate: '2024-02-20T00:00:00',
  quantity: 2,
  status: 'Planned',
  createdAt: '2024-02-10T00:00:00',
  updatedAt: null,
  product: {
    id: 'prod-1',
    name: 'Produto',
    description: null,
    createdAt: '2024-02-01T00:00:00',
    updatedAt: null,
    parts: [],
  },
  parts: [],
  ...overrides,
})

describe('useProductionSchedules', () => {
  const wrapper = createQueryClientWrapper().Wrapper

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches schedules with filters', async () => {
    const data = [mockSchedule()]
    const spy = vi.spyOn(productionSchedulesApi, 'list').mockResolvedValueOnce(data)
    const filters = { scheduledDate: '2024-02-20', status: 'Planned' }

    const { result } = renderHook(() => useProductionSchedules(filters), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(data)
    expect(spy).toHaveBeenCalledWith(filters)
  })

  it('exposes error state when request fails', async () => {
    const error = new Error('Boom')
    vi.spyOn(productionSchedulesApi, 'list').mockRejectedValueOnce(error)

    const { result } = renderHook(() => useProductionSchedules(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(error)
  })
})
