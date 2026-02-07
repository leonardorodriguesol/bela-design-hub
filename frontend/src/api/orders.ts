import { httpClient } from '../lib/httpClient'
import type { CreateOrderInput, Order, OrderStatus, UpdateOrderInput } from '../types/order'

type OrderApiResponse = Omit<Order, 'status'> & { status: OrderStatus | number }

const statusMap: Record<number, OrderStatus> = {
  0: 'Pending',
  1: 'InProduction',
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled',
}

const statusNumberMap: Record<OrderStatus, number> = {
  Pending: 0,
  InProduction: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
}

const normalizeStatus = (status: OrderStatus | number): OrderStatus => {
  if (typeof status === 'string') return status
  return statusMap[status] ?? 'Pending'
}

const mapOrder = (order: OrderApiResponse): Order => ({
  ...order,
  status: normalizeStatus(order.status),
})

export const ordersApi = {
  list: async (params?: {
    customerId?: string
    status?: string
    createdFrom?: string
    createdTo?: string
  }) => {
    const { data } = await httpClient.get<OrderApiResponse[]>('/api/orders', { params })
    return data.map(mapOrder)
  },
  get: async (id: string) => {
    const { data } = await httpClient.get<OrderApiResponse>(`/api/orders/${id}`)
    return mapOrder(data)
  },
  create: async (payload: CreateOrderInput) => {
    const { data } = await httpClient.post<OrderApiResponse>('/api/orders', payload)
    return mapOrder(data)
  },
  update: async (id: string, payload: UpdateOrderInput) => {
    const serializedPayload = {
      ...payload,
      status: typeof payload.status === 'string' ? statusNumberMap[payload.status] : payload.status,
    }
    const { data } = await httpClient.put<OrderApiResponse>(`/api/orders/${id}`, serializedPayload)
    return mapOrder(data)
  },
  remove: async (id: string) => {
    await httpClient.delete(`/api/orders/${id}`)
    return id
  },
}
