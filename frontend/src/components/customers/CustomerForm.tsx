import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { SubmitHandler } from 'react-hook-form'

import type { CreateCustomerInput } from '../../types/customer'

const customerSchema = z.object({
  name: z.string().min(2, 'Informe pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  defaultValues?: CreateCustomerInput
  onSubmit: (values: CreateCustomerInput) => Promise<void> | void
  isSubmitting?: boolean
}

const toFormValues = (values?: CreateCustomerInput): CustomerFormValues => ({
  name: values?.name ?? '',
  email: values?.email ?? undefined,
  phone: values?.phone ?? undefined,
  address: values?.address ?? undefined,
})

export const CustomerForm = ({ defaultValues, onSubmit, isSubmitting }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: toFormValues(defaultValues),
  })

  useEffect(() => {
    reset(toFormValues(defaultValues))
  }, [defaultValues, reset])

  const handleFormSubmit: SubmitHandler<CustomerFormValues> = async (values) => {
    const payload: CreateCustomerInput = {
      name: values.name.trim(),
      email: values.email?.trim() ? values.email.trim() : undefined,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
      address: values.address?.trim() ? values.address.trim() : undefined,
    }

    await onSubmit(payload)

    reset(toFormValues(defaultValues))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-brand-700">Nome*</label>
        <input
          {...register('name')}
          className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
          placeholder="Cliente Exemplo"
        />
        {errors.name && <p className="text-xs text-brand-600">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-brand-700">Email</label>
          <input
            {...register('email')}
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
            placeholder="contato@cliente.com"
          />
          {errors.email && <p className="text-xs text-brand-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-brand-700">Telefone</label>
          <input
            {...register('phone')}
            className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
            placeholder="(11) 99999-0000"
          />
          {errors.phone && <p className="text-xs text-brand-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-brand-700">Endereço</label>
        <input
          {...register('address')}
          className="w-full rounded-xl border border-brand-100 px-4 py-2 text-sm text-brand-700 placeholder:text-brand-200 focus:border-brand-500 focus:outline-none"
          placeholder="Rua Bella, 123"
        />
        {errors.address && <p className="text-xs text-brand-600">{errors.address.message}</p>}
      </div>

      <button
        type="submit"
        className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar cliente'}
      </button>
    </form>
  )
}
