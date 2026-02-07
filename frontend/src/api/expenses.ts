import { httpClient } from '../lib/httpClient'
import type { CreateExpenseInput, Expense, ExpenseCategory, UpdateExpenseInput } from '../types/expense'

type ExpenseApiResponse = Omit<Expense, 'category'> & { category: ExpenseCategory | number }

const categoryMap: Record<number, ExpenseCategory> = {
  0: 'Materials',
  1: 'Labor',
  2: 'Logistics',
  3: 'Utilities',
  99: 'Other',
}

const categoryNumberMap: Record<ExpenseCategory, number> = {
  Materials: 0,
  Labor: 1,
  Logistics: 2,
  Utilities: 3,
  Other: 99,
}

const normalizeCategory = (category: ExpenseCategory | number): ExpenseCategory => {
  if (typeof category === 'string') return category
  return categoryMap[category] ?? 'Other'
}

const mapExpense = (expense: ExpenseApiResponse): Expense => ({
  ...expense,
  category: normalizeCategory(expense.category),
})

export const expensesApi = {
  list: async (params?: {
    startDate?: string
    endDate?: string
    category?: ExpenseCategory
  }) => {
    const serializedParams = params?.category
      ? { ...params, category: categoryNumberMap[params.category] }
      : params

    const { data } = await httpClient.get<ExpenseApiResponse[]>('/api/expenses', { params: serializedParams })
    return data.map(mapExpense)
  },
  get: async (id: string) => {
    const { data } = await httpClient.get<ExpenseApiResponse>(`/api/expenses/${id}`)
    return mapExpense(data)
  },
  create: async (payload: CreateExpenseInput) => {
    const serializedPayload = {
      ...payload,
      category:
        typeof payload.category === 'string' ? categoryNumberMap[payload.category] : payload.category,
    }
    const { data } = await httpClient.post<ExpenseApiResponse>('/api/expenses', serializedPayload)
    return mapExpense(data)
  },
  update: async (id: string, payload: UpdateExpenseInput) => {
    const serializedPayload = {
      ...payload,
      category:
        typeof payload.category === 'string' ? categoryNumberMap[payload.category] : payload.category,
    }
    const { data } = await httpClient.put<ExpenseApiResponse>(`/api/expenses/${id}`, serializedPayload)
    return mapExpense(data)
  },
  remove: async (id: string) => {
    await httpClient.delete(`/api/expenses/${id}`)
    return id
  },
}
