export interface ProductPart {
  id?: string
  name: string
  quantity: number
}

export interface Product {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt?: string | null
  parts: ProductPart[]
}

export interface CreateProductInput {
  name: string
  description?: string | null
  parts: Array<{ name: string; quantity: number }>
}

export type UpdateProductInput = CreateProductInput

export type ProductionStatus = 'Planned' | 'InProgress' | 'Completed' | 'Cancelled'

export interface ProductionSchedulePart {
  id?: string
  name: string
  quantity: number
}

export interface ProductionSchedule {
  id: string
  productId: string
  product?: Product
  scheduledDate: string
  quantity: number
  status: ProductionStatus
  createdAt: string
  updatedAt?: string | null
  parts: ProductionSchedulePart[]
}

export interface CreateProductionScheduleInput {
  productId: string
  scheduledDate: string
  quantity: number
}

export interface UpdateProductionStatusInput {
  status: ProductionStatus
}
