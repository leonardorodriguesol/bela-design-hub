import { isAxiosError } from 'axios'
import { useMemo, useState } from 'react'

import { ProductForm } from '../../components/production/ProductForm'
import { ProductionScheduleForm } from '../../components/production/ProductionScheduleForm'
import { useProductMutations } from '../../hooks/useProductMutations'
import { useProducts } from '../../hooks/useProducts'
import { useProductionScheduleMutations } from '../../hooks/useProductionScheduleMutations'
import { useProductionSchedules } from '../../hooks/useProductionSchedules'
import type { CreateProductInput, CreateProductionScheduleInput, Product, ProductionSchedule, ProductionStatus } from '../../types/product'

const statusOptions: { label: string; value: ProductionStatus }[] = [
  { label: 'Planejado', value: 'Planned' },
  { label: 'Em produção', value: 'InProgress' },
  { label: 'Concluído', value: 'Completed' },
  { label: 'Cancelado', value: 'Cancelled' },
]

const statusStyles: Record<ProductionStatus, { label: string; badge: string }> = {
  Planned: { label: 'Planejado', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  InProgress: { label: 'Em produção', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  Completed: { label: 'Concluído', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Cancelled: { label: 'Cancelado', badge: 'bg-red-50 text-red-700 border-red-200' },
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

const formatDateInput = (value?: string) => {
  const parts = getDateParts(value)
  if (!parts) return ''
  const { day, month, year } = parts
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

const scheduleDateKey = (schedule: ProductionSchedule) => formatDateInput(schedule.scheduledDate) || schedule.scheduledDate

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
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [filters, setFilters] = useState<{ scheduledDate?: string; status?: ProductionStatus | 'All' }>({})
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success')
  const [formError, setFormError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback(message)
    setFeedbackType(type)
    setTimeout(() => setFeedback(null), 4000)
  }

  const { data: products, isLoading: loadingProducts, error: productsError } = useProducts()
  const { create: createProduct, update: updateProduct, remove: removeProduct } = useProductMutations()

  const scheduleFilters = useMemo(
    () => ({
      scheduledDate: filters.scheduledDate || undefined,
      status: filters.status && filters.status !== 'All' ? filters.status : undefined,
    }),
    [filters],
  )

  const {
    data: schedules,
    isLoading: loadingSchedules,
    error: schedulesError,
  } = useProductionSchedules(scheduleFilters)

  const { create: createSchedule, updateStatus, remove: removeSchedule } = useProductionScheduleMutations()

  const groupedSchedules = useMemo(() => {
    if (!schedules || schedules.length === 0) return []
    const grouped = schedules.reduce<Record<string, ProductionSchedule[]>>((acc, schedule) => {
      const key = scheduleDateKey(schedule)
      acc[key] = acc[key] ? [...acc[key], schedule] : [schedule]
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([date, items]) => ({ date, items: items.sort((a, b) => b.quantity - a.quantity) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
  }, [schedules])

  const scheduleStats = useMemo(() => {
    const totalSchedules = schedules?.length ?? 0
    const planned = schedules?.filter((schedule) => schedule.status === 'Planned').length ?? 0
    const inProgress = schedules?.filter((schedule) => schedule.status === 'InProgress').length ?? 0
    const completed = schedules?.filter((schedule) => schedule.status === 'Completed').length ?? 0
    const nextDate = groupedSchedules[0]?.date
    const uniqueDays = groupedSchedules.length
    return { totalSchedules, planned, inProgress, completed, nextDate, uniqueDays }
  }, [groupedSchedules, schedules])

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

  const handleDeleteProduct = (product: Product) => {
    if (!window.confirm(`Deseja remover "${product.name}"?`)) return
    removeProduct.mutate(product.id, {
      onSuccess: () => showMessage('Produto removido com sucesso!'),
      onError: () => showMessage('Erro ao remover produto.', 'error'),
    })
  }

  const handleCreateSchedule = async (values: CreateProductionScheduleInput) => {
    setFormError(null)
    try {
      await createSchedule.mutateAsync(values)
      showMessage('Produção planejada!')
      setScheduleModalOpen(false)
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao planejar produção.')
      setFormError(message)
      showMessage(message, 'error')
    }
  }

  const handleStatusChange = async (schedule: ProductionSchedule, status: ProductionStatus) => {
    if (schedule.status === status) return
    try {
      await updateStatus.mutateAsync({ id: schedule.id, payload: { status } })
      showMessage('Status atualizado!')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao atualizar status.')
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
    <section className="space-y-8">
      <header className="space-y-3 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white/40 p-6 text-brand-700 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Produção diária</p>
          <h2 className="text-3xl font-semibold text-brand-800">Planeje hoje o que entra na marcenaria</h2>
          <p className="text-sm text-brand-500">
            Priorize o cronograma; o catálogo de produtos aparece sob demanda quando você precisar consultar peças ou cadastrar um novo item.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Dias com produção</p>
            <p className="text-2xl font-semibold text-brand-800">{scheduleStats.uniqueDays}</p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Planejado</p>
            <p className="text-2xl font-semibold text-brand-800">{scheduleStats.planned}</p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Em produção</p>
            <p className="text-2xl font-semibold text-brand-800">{scheduleStats.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Próximo dia</p>
            <p className="text-2xl font-semibold text-brand-800">
              {scheduleStats.nextDate ? formatDate(scheduleStats.nextDate) : '—'}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <div className="rounded-2xl border border-brand-200 bg-white/70 px-4 py-3 text-brand-600">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Produtos</p>
            <p>Abra o catálogo apenas quando precisar visualizar peças. O foco aqui é o andamento da produção.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-2xl border border-brand-200 px-4 py-2 font-semibold text-brand-600 transition hover:bg-brand-50"
              onClick={() => {
                setCatalogOpen(true)
                setFormError(null)
              }}
            >
              Ver catálogo de produtos
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-2 font-semibold text-white shadow hover:bg-brand-400"
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Planejamento diário</p>
            <h3 className="text-xl font-semibold text-brand-800">Acompanhe o que vai para a marcenaria</h3>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-400"
            onClick={() => {
              setScheduleModalOpen(true)
              setFormError(null)
            }}
          >
            <span aria-hidden>📅</span>
            Planejar dia
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-brand-500">
            <span className="mb-1 block font-medium text-brand-700">Data</span>
            <input
              type="date"
              className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
              value={filters.scheduledDate ?? ''}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  scheduledDate: event.target.value || undefined,
                }))
              }
            />
          </label>

          <label className="text-sm text-brand-500">
            <span className="mb-1 block font-medium text-brand-700">Status</span>
            <select
              className="w-full rounded-2xl border border-brand-100 px-4 py-2 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
              value={filters.status ?? 'All'}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: (event.target.value as ProductionStatus | 'All') || undefined,
                }))
              }
            >
              <option value="All">Todos</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {formError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{formError}</div>
        )}

        {loadingSchedules && <p className="text-sm text-brand-500">Carregando planejamentos...</p>}
        {schedulesError && (
          <p className="text-sm text-red-600">Não foi possível carregar os planejamentos. Verifique se a API está ativa.</p>
        )}
        {!loadingSchedules && !schedulesError && groupedSchedules.length === 0 && (
          <p className="rounded-2xl border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-brand-500">
            Nenhum planejamento encontrado para os filtros aplicados.
          </p>
        )}

        <div className="space-y-4">
          {groupedSchedules.map((group) => (
            <article key={group.date} className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-sm">
              <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Dia</p>
                  <h4 className="text-lg font-semibold text-brand-800">{formatDate(group.date)}</h4>
                </div>
              </header>

              <div className="space-y-4">
                {group.items.map((schedule) => {
                  const productName = schedule.product?.name ?? 'Produto'
                  const statusInfo = statusStyles[schedule.status]
                  return (
                    <div
                      key={schedule.id}
                      className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Produto</p>
                          <h5 className="text-lg font-semibold text-brand-800">{productName}</h5>
                          <p className="text-sm text-brand-500">Quantidade: {schedule.quantity}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badge}`}>
                            {statusInfo.label}
                          </span>
                          <select
                            className="rounded-2xl border border-brand-200 px-3 py-1 text-xs text-brand-600 focus:border-brand-500 focus:outline-none"
                            value={schedule.status}
                            onChange={(event) => handleStatusChange(schedule, event.target.value as ProductionStatus)}
                          >
                            {statusOptions.map((status) => (
                              <option key={`${schedule.id}-${status.value}`} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="rounded-full border border-transparent p-1.5 text-brand-500 transition hover:border-brand-100 hover:bg-brand-50"
                            title="Remover planejamento"
                            onClick={() => handleDeleteSchedule(schedule)}
                            disabled={removeSchedule.isPending}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[300px] text-left text-sm text-brand-700">
                          <thead>
                            <tr className="text-xs uppercase tracking-wide text-brand-400">
                              <th className="pb-1">Peça</th>
                              <th className="pb-1 text-right">Quantidade total</th>
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
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
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

      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Planejar</p>
                <h3 className="text-xl font-semibold text-brand-700">Nova produção</h3>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-brand-500 hover:text-brand-700"
                onClick={() => {
                  setScheduleModalOpen(false)
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

            <ProductionScheduleForm
              products={products ?? []}
              onSubmit={handleCreateSchedule}
              isSubmitting={createSchedule.isPending}
            />
          </div>
        </div>
      )}

      {catalogOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl">
            <header className="mb-4 flex flex-col gap-2 text-brand-700 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Catálogo</p>
                <h3 className="text-2xl font-semibold">Produtos e peças</h3>
                <p className="text-sm text-brand-500">Consulte rapidamente a composição das peças antes de planejar.</p>
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-400"
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

            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 md:grid-cols-2">
                {loadingProducts && <p className="text-sm text-brand-500">Carregando produtos...</p>}
                {productsError && <p className="text-sm text-red-600">Não foi possível carregar os produtos.</p>}
                {!loadingProducts && !productsError && products && products.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-brand-500">
                    Nenhum produto cadastrado ainda.
                  </p>
                )}

                {!loadingProducts && !productsError &&
                  products?.map((product) => (
                    <article key={product.id} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 shadow-sm">
                      <header className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-brand-800">{product.name}</h4>
                          {product.description && <p className="text-sm text-brand-500">{product.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-transparent p-1.5 text-brand-500 transition hover:border-brand-100 hover:bg-white"
                            title="Editar"
                            onClick={() => {
                              setEditingProduct(product)
                              setProductModalOpen(true)
                              setFormError(null)
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-transparent p-1.5 text-brand-500 transition hover:border-brand-100 hover:bg-white"
                            title="Excluir"
                            onClick={() => handleDeleteProduct(product)}
                            disabled={removeProduct.isPending}
                          >
                            🗑️
                          </button>
                        </div>
                      </header>

                      <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Peças</p>
                      <ul className="mt-2 space-y-1 text-sm text-brand-700">
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
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
