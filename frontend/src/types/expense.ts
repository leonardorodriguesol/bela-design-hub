export type ExpenseCategory = 'Materials' | 'Labor' | 'Logistics' | 'Utilities' | 'Other'

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  expenseDate: string
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface CreateExpenseInput {
  description: string
  amount: number
  category: ExpenseCategory
  expenseDate: string
  notes?: string | null
}

export type UpdateExpenseInput = CreateExpenseInput
