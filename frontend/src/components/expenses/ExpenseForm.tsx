import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { ExpenseCategory } from '../../types/expense'

const expenseSchema = z.object({
  description: z.string().min(3, 'Descrição obrigatória'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  category: z.string().min(1, 'Categoria obrigatória'),
  expenseDate: z.string().min(1, 'Data obrigatória'),
  notes: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  categories: { label: string; value: ExpenseCategory }[]
  defaultValues?: ExpenseFormValues
  onSubmit: (values: ExpenseFormValues) => Promise<void> | void
  isSubmitting?: boolean
}

export const ExpenseForm = ({ categories, defaultValues, onSubmit, isSubmitting }: ExpenseFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues ?? {
      description: '',
      amount: 0,
      category: 'Other',
      expenseDate: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const handleFormSubmit = async (values: ExpenseFormValues) => {
    await onSubmit(values)

    if (!defaultValues) {
      reset({
        description: '',
        amount: 0,
        category: 'Other',
        expenseDate: '',
        notes: '',
      })
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Descrição*</span>
          <input
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
            placeholder="Ex.: Compra de papel"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-brand-600">{errors.description.message}</p>}
        </label>

        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Valor*</span>
          <input
            type="number"
            step="0.01"
            min={0}
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-xs text-brand-600">{errors.amount.message}</p>}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Categoria*</span>
          <select
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
            {...register('category')}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-brand-600">{errors.category.message}</p>}
        </label>

        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Data*</span>
          <input
            type="date"
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
            {...register('expenseDate')}
          />
          {errors.expenseDate && <p className="text-xs text-brand-600">{errors.expenseDate.message}</p>}
        </label>
      </div>

      <label className="text-sm text-brand-600">
        <span className="mb-1 block font-semibold text-brand-700">Notas</span>
        <textarea
          className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
          rows={3}
          placeholder="Anotações extras"
          {...register('notes')}
        />
        {errors.notes && <p className="text-xs text-brand-600">{errors.notes.message}</p>}
      </label>

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando despesa...' : 'Salvar despesa'}
      </button>
    </form>
  )
}
