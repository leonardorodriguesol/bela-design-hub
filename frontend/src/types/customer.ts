export interface Customer {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface CreateCustomerInput {
  name: string
  email?: string
  phone?: string
  address?: string
}

export type UpdateCustomerInput = CreateCustomerInput
