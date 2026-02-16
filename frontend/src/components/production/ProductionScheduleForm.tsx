import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { CreateProductionScheduleInput, Product } from '../../types/product'

const scheduleSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, 'Selecione um produto válido')
    .refine((value) => /^[0-9a-fA-F-]{36}$/.test(value), 'Selecione um produto válido'),
  scheduledDate: z.string().min(1, 'Informe a data'),
  quantity: z.number().min(1, 'Quantidade mínimo 1'),
})

export type ProductionScheduleFormValues = z.infer<typeof scheduleSchema>

interface ProductionScheduleFormProps {
  products: Product[]
  defaultValues?: ProductionScheduleFormValues
  onSubmit: (values: CreateProductionScheduleInput) => Promise<void> | void
  isSubmitting?: boolean
}

const toFormValues = (values?: ProductionScheduleFormValues): ProductionScheduleFormValues => ({
  productId: values?.productId ?? '',
  scheduledDate: values?.scheduledDate ?? '',
  quantity: values?.quantity ?? 1,
})

export const ProductionScheduleForm = ({ products, defaultValues, onSubmit, isSubmitting }: ProductionScheduleFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductionScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: toFormValues(defaultValues),
  })

  useEffect(() => {
    reset(toFormValues(defaultValues))
  }, [defaultValues, reset])

  const handleFormSubmit = async (values: ProductionScheduleFormValues) => {
    const payload: CreateProductionScheduleInput = {
      productId: values.productId,
      scheduledDate: values.scheduledDate,
      quantity: values.quantity,
    }

    await onSubmit(payload)

    if (!defaultValues) {
      reset(toFormValues())
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <label className="text-sm text-brand-600">
        <span className="mb-1 block font-semibold text-brand-700">Produto*</span>
        <select
          className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
          {...register('productId')}
        >
          <option value="">Selecione</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && <p className="text-xs text-red-600">{errors.productId.message}</p>}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Data*</span>
          <input
            type="date"
            className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
            {...register('scheduledDate')}
          />
          {errors.scheduledDate && <p className="text-xs text-red-600">{errors.scheduledDate.message}</p>}
        </label>

        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Quantidade*</span>
          <input
            type="number"
            min={1}
            className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && <p className="text-xs text-red-600">{errors.quantity.message}</p>}
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Planejando...' : 'Salvar produção'}
      </button>
    </form>
  )
}
