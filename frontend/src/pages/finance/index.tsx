import { useMemo, useState } from 'react'

import { useOrders } from '../../hooks/useOrders'
import { useExpenses } from '../../hooks/useExpenses'

const getMonthOptions = (count: number) => {
  const now = new Date()
  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      value: `${date.getFullYear()}-${date.getMonth()}`,
    }
  })
}

export const Finance = () => {
  const monthOptions = useMemo(() => getMonthOptions(12), [])
  const [selectedMonth, setSelectedMonth] = useState(() => ({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }))

  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: expenses, isLoading: expensesLoading } = useExpenses()

  const period = useMemo(() => {
    const start = new Date(selectedMonth.year, selectedMonth.month, 1)
    const end = new Date(selectedMonth.year, selectedMonth.month + 1, 0)
    return { start, end }
  }, [selectedMonth])

  const deliveredOrders = useMemo(() => {
    if (!orders) return []
    return orders.filter((order) => {
      if (order.status !== 'Delivered') return false
      const accountingDate = new Date(order.deliveryDate ?? order.createdAt)
      if (Number.isNaN(accountingDate.getTime())) return false
      if (accountingDate < period.start) return false
      const endOfDay = new Date(period.end)
      endOfDay.setHours(23, 59, 59, 999)
      if (accountingDate > endOfDay) return false
      return true
    })
  }, [orders, period])

  const filteredExpenses = useMemo(() => {
    if (!expenses) return []
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.expenseDate)
      if (expenseDate < period.start) return false
      const endOfDay = new Date(period.end)
      endOfDay.setHours(23, 59, 59, 999)
      if (expenseDate > endOfDay) return false
      return true
    })
  }, [expenses, period])

  const summary = useMemo(() => {
    const totalOrders = deliveredOrders.length
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    return { totalOrders, totalRevenue, totalExpenses }
  }, [deliveredOrders, filteredExpenses])

  const loading = ordersLoading || expensesLoading
  const periodLabel = period.start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const periodBalance = summary.totalRevenue - summary.totalExpenses
  const hasNoData = !loading && deliveredOrders.length === 0 && filteredExpenses.length === 0

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-3xl border border-brand-100 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Financeiro</p>
            <h1 className="text-3xl font-semibold text-brand-800">Visão mensal do caixa</h1>
            <p className="text-sm text-brand-500">
              Faturamento com pedidos entregues e despesas registradas no período selecionado.
            </p>
          </div>

          <label className="w-full max-w-xs text-sm text-brand-500">
            <span className="mb-2 block font-medium text-brand-700">Período</span>
            <select
              className="w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-brand-700 focus:border-brand-500 focus:outline-none"
              value={`${selectedMonth.year}-${selectedMonth.month}`}
              onChange={(event) => {
                const [year, month] = event.target.value.split('-').map(Number)
                setSelectedMonth({ year, month })
              }}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Período</p>
          <p className="mt-3 text-lg font-semibold text-brand-800">{periodLabel}</p>
        </article>

        <article className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Pedidos entregues</p>
          <p className="mt-3 text-2xl font-semibold text-brand-800">
            {loading ? '—' : summary.totalOrders.toLocaleString('pt-BR')}
          </p>
        </article>

        <article className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Faturamento</p>
          <p className="mt-3 text-2xl font-semibold text-brand-800">
            {loading ? '—' : summary.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="mt-1 text-xs text-brand-500">Soma dos pedidos entregues</p>
        </article>

        <article className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Resultado</p>
          <p className={`mt-3 text-2xl font-semibold ${periodBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {loading ? '—' : periodBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="mt-1 text-xs text-brand-500">
            {loading
              ? '—'
              : `${summary.totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em despesas`}
          </p>
        </article>
      </div>

      {hasNoData && (
        <div className="rounded-2xl border border-brand-100 bg-white px-5 py-4 text-sm text-brand-600 shadow-sm">
          Não há dados para o período selecionado.
        </div>
      )}
    </section>
  )
}
