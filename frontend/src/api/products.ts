import { httpClient } from '../lib/httpClient'
import type {
  CreateProductInput,
  Product,
  ProductionSchedule,
  CreateProductionScheduleInput,
  UpdateProductionStatusInput,
  ProductionStatus,
} from '../types/product'

export const productsApi = {
  list: async () => {
    const { data } = await httpClient.get<Product[]>('/api/products')
    return data
  },
  create: async (payload: CreateProductInput) => {
    const { data } = await httpClient.post<Product>('/api/products', payload)
    return data
  },
  update: async (id: string, payload: CreateProductInput) => {
    const { data } = await httpClient.put<Product>(`/api/products/${id}`, payload)
    return data
  },
  remove: async (id: string) => {
    await httpClient.delete(`/api/products/${id}`)
    return id
  },
}

const statusMap: Record<number, ProductionStatus> = {
  0: 'Planned',
  1: 'InProgress',
  2: 'Completed',
  3: 'Cancelled',
}

const statusNumberMap: Record<ProductionStatus, number> = {
  Planned: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
}

type ProductionScheduleApiResponse = Omit<ProductionSchedule, 'status'> & { status: number | string }

const parseStatus = (status: number | string): ProductionStatus => {
  if (typeof status === 'number') {
    return statusMap[status] ?? 'Planned'
  }

  if (['Planned', 'InProgress', 'Completed', 'Cancelled'].includes(status)) {
    return status as ProductionStatus
  }

  return 'Planned'
}

const mapSchedule = (schedule: ProductionScheduleApiResponse): ProductionSchedule => ({
  ...schedule,
  status: parseStatus(schedule.status),
})

export const productionSchedulesApi = {
  list: async (params?: { scheduledDate?: string; startDate?: string; endDate?: string; status?: string }) => {
    const { data } = await httpClient.get<ProductionScheduleApiResponse[]>('/api/productionSchedules', { params })
    return data.map(mapSchedule)
  },
  get: async (id: string) => {
    const { data } = await httpClient.get<ProductionScheduleApiResponse>(`/api/productionSchedules/${id}`)
    return mapSchedule(data)
  },
  create: async (payload: CreateProductionScheduleInput) => {
    const { data } = await httpClient.post<ProductionScheduleApiResponse>('/api/productionSchedules', payload)
    return mapSchedule(data)
  },
  updateStatus: async (id: string, payload: UpdateProductionStatusInput) => {
    const serialized = {
      status: typeof payload.status === 'string' ? statusNumberMap[payload.status] : payload.status,
    }
    const { data } = await httpClient.patch<ProductionScheduleApiResponse>(
      `/api/productionSchedules/${id}/status`,
      serialized,
    )
    return mapSchedule(data)
  },
  remove: async (id: string) => {
    await httpClient.delete(`/api/productionSchedules/${id}`)
    return id
  },
}
