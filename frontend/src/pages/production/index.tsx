import { isAxiosError } from 'axios'
import { useMemo, useState } from 'react'

import { ProductForm } from '../../components/production/ProductForm'
import { useProductMutations } from '../../hooks/useProductMutations'
import { useProducts } from '../../hooks/useProducts'
import { useProductionScheduleMutations } from '../../hooks/useProductionScheduleMutations'
import { useProductionSchedules } from '../../hooks/useProductionSchedules'
import type { CreateProductInput, CreateProductionScheduleInput, Product, ProductionSchedule } from '../../types/product'

const getLocalDateString = () => {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  const local = new Date(now.getTime() - tzOffset)
  return local.toISOString().split('T')[0]
}

const getDateParts = (value?: string) => {
  if (!value) return null
  const datePart = value.split('T')[0]
  if (!datePart) return null
  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day) return null
  return { year, month, day }
}

const formatDate = (value: string) => {
  const parts = getDateParts(value)
  if (!parts) return 'Data inválida'
  const { day, month, year } = parts
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
}

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (isAxiosError(err)) {
    const data = err.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      if ('message' in data && typeof (data as { message?: string }).message === 'string') {
        return (data as { message: string }).message
      }
      if ('errors' in data && data.errors && typeof data.errors === 'object') {
        const errorsObj = data.errors as Record<string, string | string[]>
        const firstKey = Object.keys(errorsObj)[0]
        if (firstKey) {
          const value = errorsObj[firstKey]
          if (Array.isArray(value)) return value[0]
          if (typeof value === 'string') return value
        }
      }
      if ('title' in data && typeof (data as { title?: string }).title === 'string') {
        return (data as { title: string }).title
      }
    }
  }
  return fallback
}

export const Production = () => {
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString())
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success')
  const [formError, setFormError] = useState<string | null>(null)
  const [planProductId, setPlanProductId] = useState('')
  const [planQuantity, setPlanQuantity] = useState(1)
  const [planError, setPlanError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback(message)
    setFeedbackType(type)
    setTimeout(() => setFeedback(null), 4000)
  }

  const { data: products } = useProducts()
  const { create: createProduct, update: updateProduct } = useProductMutations()

  const scheduleFilters = useMemo(() => ({ scheduledDate: selectedDate }), [selectedDate])

  const {
    data: schedules,
    isLoading: loadingSchedules,
    error: schedulesError,
  } = useProductionSchedules(scheduleFilters)

  const { create: createSchedule, remove: removeSchedule } = useProductionScheduleMutations()

  const daySchedules = useMemo(() => schedules ?? [], [schedules])
  const totalQuantity = daySchedules.reduce((sum, schedule) => sum + schedule.quantity, 0)

  const handleCreateProduct = async (values: CreateProductInput) => {
    setFormError(null)
    try {
      await createProduct.mutateAsync(values)
      showMessage('Produto criado com sucesso!')
      setProductModalOpen(false)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao criar produto.')
      setFormError(message)
      showMessage(message, 'error')
    }
  }

  const handleUpdateProduct = async (values: CreateProductInput) => {
    if (!editingProduct) return
    setFormError(null)
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, payload: values })
      showMessage('Produto atualizado com sucesso!')
      setEditingProduct(null)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao atualizar produto.')
      setFormError(message)
      showMessage(message, 'error')
    }
  }

  const handleCreateSchedule = async (values: CreateProductionScheduleInput) => {
    setFormError(null)
    try {
      await createSchedule.mutateAsync(values)
      showMessage('Produção planejada!')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao planejar produção.')
      setFormError(message)
      showMessage(message, 'error')
    }
  }

  const handleDeleteSchedule = (schedule: ProductionSchedule) => {
    if (!window.confirm('Deseja cancelar este planejamento?')) return
    removeSchedule.mutate(schedule.id, {
      onSuccess: () => showMessage('Planejamento removido!'),
      onError: () => showMessage('Erro ao remover planejamento.', 'error'),
    })
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-3xl border border-brand-100 bg-white/90 p-6 text-brand-700 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Produção diária</p>
            <h2 className="text-3xl font-semibold text-brand-800">Planeje apenas o que entra hoje</h2>
            <p className="text-sm text-brand-500">Selecione a data, informe os produtos e comece o dia com o plano alinhado.</p>
          </div>
          <label className="text-sm text-brand-600">
            <span className="mb-1 block font-semibold text-brand-700">Dia de produção</span>
            <input
              type="date"
              className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-brand-700 focus:border-brand-500 focus:outline-none"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value || getLocalDateString())}
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-brand-200 px-4 py-3 text-brand-600">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Produtos cadastrados</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-semibold text-brand-800">{products?.length ?? 0}</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                onClick={() => {
                  setEditingProduct(null)
                  setProductModalOpen(true)
                  setFormError(null)
                }}
              >
                <span aria-hidden>＋</span>
                Novo produto
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-brand-100 px-4 py-3 text-brand-600">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Quantidade planejada no dia</p>
            <p className="mt-2 text-2xl font-semibold text-brand-800">{totalQuantity}</p>
          </div>
          <div className="rounded-2xl border border-brand-100 px-4 py-3 text-brand-600">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Catálogo</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-brand-500">Visualize peças e combinações</p>
              <button
                type="button"
                className="rounded-2xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                onClick={() => setCatalogOpen(true)}
              >
                Ver catálogo
              </button>
            </div>
          </div>
        </div>
      </header>

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedbackType === 'success' ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {feedback}
        </div>
      )}

      <section className="space-y-4 rounded-3xl border border-brand-100 bg-white/95 p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Plano do dia</p>
            <h3 className="text-xl font-semibold text-brand-800">Inclua o que será produzido em {formatDate(selectedDate)}</h3>
          </div>

          <form
            className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 md:flex-row md:items-end"
            onSubmit={async (event) => {
              event.preventDefault()
              setPlanError(null)
              if (!planProductId) {
                setPlanError('Selecione um produto para produzir')
                return
              }

              try {
                await handleCreateSchedule({
                  productId: planProductId,
                  quantity: planQuantity,
                  scheduledDate: selectedDate,
                })
                setPlanProductId('')
                setPlanQuantity(1)
              } catch {
                setPlanError('Não foi possível salvar o plano. Verifique a API.')
              }
            }}
          >
            <label className="flex-1 text-sm text-brand-600">
              <span className="mb-1 block font-semibold text-brand-700">Produto</span>
              <select
                className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
                value={planProductId}
                onChange={(event) => setPlanProductId(event.target.value)}
              >
                <option value="">Selecione</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="w-full text-sm text-brand-600 md:w-40">
              <span className="mb-1 block font-semibold text-brand-700">Quantidade</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
                value={planQuantity}
                onChange={(event) => setPlanQuantity(Math.max(1, Number(event.target.value)))}
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 md:w-auto"
              disabled={createSchedule.isPending}
            >
              {createSchedule.isPending ? 'Salvando...' : 'Adicionar ao plano'}
            </button>
          </form>

          {planError && <p className="text-sm text-red-600">{planError}</p>}
          {formError && <p className="text-sm text-red-600">{formError}</p>}
        </div>

        {loadingSchedules && <p className="text-sm text-brand-500">Carregando planejamentos...</p>}
        {schedulesError && (
          <p className="text-sm text-red-600">Não foi possível carregar os planejamentos. Verifique se a API está ativa.</p>
        )}
        {!loadingSchedules && !schedulesError && daySchedules.length === 0 && (
          <p className="rounded-2xl border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-brand-500">
            Nenhum item planejado para {formatDate(selectedDate)}.
          </p>
        )}

        <div className="space-y-3">
          {daySchedules.map((schedule) => {
            const productName = schedule.product?.name ?? 'Produto'
            return (
              <article key={schedule.id} className="rounded-2xl border border-brand-100 bg-white/90 p-4 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Produto</p>
                    <h4 className="text-lg font-semibold text-brand-800">{productName}</h4>
                    <p className="text-sm text-brand-500">Quantidade: {schedule.quantity}</p>
                  </div>
                  <button
                    type="button"
                    className="self-start rounded-full border border-transparent p-1.5 text-brand-500 transition hover:border-brand-100 hover:bg-brand-50"
                    title="Remover do plano"
                    onClick={() => handleDeleteSchedule(schedule)}
                    disabled={removeSchedule.isPending}
                  >
                    🗑️
                  </button>
                </div>

                {schedule.parts.length > 0 && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-sm text-brand-700">
                      <thead>
                        <tr className="text-xs uppercase tracking-wide text-brand-400">
                          <th className="pb-1">Peça</th>
                          <th className="pb-1 text-right">Qtd.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.parts.map((part) => (
                          <tr key={`${schedule.id}-${part.name}`}>
                            <td className="py-1 text-brand-600">{part.name}</td>
                            <td className="py-1 text-right text-brand-800">{part.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {(productModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-400">{editingProduct ? 'Editar' : 'Novo'}</p>
                <h3 className="text-xl font-semibold text-brand-700">
                  {editingProduct ? editingProduct.name : 'Adicionar produto'}
                </h3>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-brand-500 hover:text-brand-700"
                onClick={() => {
                  setProductModalOpen(false)
                  setEditingProduct(null)
                  setFormError(null)
                }}
              >
                Fechar
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <ProductForm
              defaultValues={editingProduct ? { name: editingProduct.name, description: editingProduct.description ?? '', parts: editingProduct.parts } : undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              isSubmitting={createProduct.isPending || updateProduct.isPending}
            />
          </div>
        </div>
      )}

      {catalogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-4xl rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl">
            <header className="mb-4 flex flex-col gap-2 text-brand-700 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Catálogo</p>
                <h3 className="text-2xl font-semibold">Produtos e peças</h3>
                <p className="text-sm text-brand-500">Use como referência rápida na hora de planejar.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                  onClick={() => setCatalogOpen(false)}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-400"
                  onClick={() => {
                    setCatalogOpen(false)
                    setEditingProduct(null)
                    setProductModalOpen(true)
                    setFormError(null)
                  }}
                >
                  <span aria-hidden>＋</span>
                  Novo produto
                </button>
              </div>
            </header>

            <div className="max-h-[60vh] overflow-y-auto">
              {products && products.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {products.map((product) => (
                    <article key={product.id} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                      <h4 className="text-lg font-semibold text-brand-800">{product.name}</h4>
                      {product.description && <p className="text-sm text-brand-500">{product.description}</p>}
                      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-brand-400">Peças</p>
                      <ul className="mt-1 space-y-1 text-sm text-brand-700">
                        {product.parts.map((part) => (
                          <li key={`${product.id}-${part.name}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-1">
                            <span>{part.name}</span>
                            <span className="text-brand-500">x{part.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-brand-500">
                  Nenhum produto cadastrado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
