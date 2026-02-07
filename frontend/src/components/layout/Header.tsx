import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/finance': 'Financeiro',
  '/customers': 'Clientes',
  '/orders': 'Pedidos',
  '/expenses': 'Despesas',
}

export const Header = () => {
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/$/, '') || '/'
  const pageTitle = pageTitles[normalizedPath] ?? 'Painel'

  return (
    <header className="flex items-center justify-between border-b border-brand-100 bg-white/80 px-8 py-4 text-brand-700 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Painel</p>
        <p className="text-lg font-semibold text-brand-700">{pageTitle}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-brand-500">
        <span className="h-2 w-2 rounded-full bg-brand-400" />
        API conectada
      </div>
    </header>
  )
}
