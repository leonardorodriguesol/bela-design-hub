import { useQuery } from '@tanstack/react-query'

import { expensesApi } from '../api/expenses'
import type { ExpenseCategory } from '../types/expense'

export const useExpenses = (filters?: {
  startDate?: string
  endDate?: string
  category?: ExpenseCategory
}) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expensesApi.list(filters),
  })
}
