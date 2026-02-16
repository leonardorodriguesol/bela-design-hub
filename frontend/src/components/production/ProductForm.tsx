import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { CreateProductInput } from '../../types/product'

const partSchema = z.object({
  name: z.string().min(2, 'Informe o nome da peça'),
  quantity: z.number().min(1, 'Quantidade mínima é 1'),
})

const productSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  parts: z.array(partSchema).min(1, 'Inclua pelo menos uma peça'),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: CreateProductInput
  onSubmit: (values: CreateProductInput) => Promise<void> | void
  isSubmitting?: boolean
}

const mapToFormValues = (values?: CreateProductInput): ProductFormValues => ({
  name: values?.name ?? '',
  description: values?.description ?? '',
  parts: values?.parts?.length ? values.parts : [{ name: '', quantity: 1 }],
})

export const ProductForm = ({ defaultValues, onSubmit, isSubmitting }: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: mapToFormValues(defaultValues),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'parts' })

  useEffect(() => {
    reset(mapToFormValues(defaultValues))
  }, [defaultValues, reset])

  const handleFormSubmit = async (values: ProductFormValues) => {
    const payload: CreateProductInput = {
      name: values.name.trim(),
      description: values.description?.trim() ? values.description.trim() : undefined,
      parts: values.parts.map((part) => ({
        name: part.name.trim(),
        quantity: part.quantity,
      })),
    }

    await onSubmit(payload)

    if (!defaultValues) {
      reset(mapToFormValues())
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Nome*</span>
          <input
            className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-300 focus:border-brand-500 focus:outline-none"
            placeholder="Ex.: Penteadeira Camarim"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </label>

        <label className="text-sm text-brand-600">
          <span className="mb-1 block font-semibold text-brand-700">Descrição</span>
          <textarea
            className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-300 focus:border-brand-500 focus:outline-none"
            rows={3}
            placeholder="Detalhes opcionais"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">Peças*</p>
            <p className="text-xs text-brand-500">Use as peças para calcular automaticamente os insumos da produção.</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
            onClick={() => append({ name: '', quantity: 1 })}
          >
            + Adicionar peça
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 md:grid-cols-[1fr_140px_auto]">
            <label className="text-sm text-brand-600">
              <span className="mb-1 block font-semibold text-brand-700">Nome</span>
              <input
                className="w-full rounded-xl border border-brand-100 px-3 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
                placeholder="Ex.: Tampo principal"
                {...register(`parts.${index}.name`)}
              />
              {errors.parts?.[index]?.name && (
                <p className="text-xs text-red-600">{errors.parts[index]?.name?.message}</p>
              )}
            </label>

            <label className="text-sm text-brand-600">
              <span className="mb-1 block font-semibold text-brand-700">Quantidade</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-brand-100 px-3 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
                {...register(`parts.${index}.quantity`, { valueAsNumber: true })}
              />
              {errors.parts?.[index]?.quantity && (
                <p className="text-xs text-red-600">{errors.parts[index]?.quantity?.message}</p>
              )}
            </label>

            <button
              type="button"
              className="self-end rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-red-500 transition hover:border-red-100 hover:bg-red-50"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remover
            </button>
          </div>
        ))}

        {typeof errors.parts?.message === 'string' && (
          <p className="text-xs text-red-600">{errors.parts.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar produto'}
      </button>
    </form>
  )
}
