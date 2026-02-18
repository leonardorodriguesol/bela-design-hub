import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Financeiro', to: '/finance' },
  { label: 'Clientes', to: '/customers' },
  { label: 'Pedidos', to: '/orders' },
  { label: 'Ordens de serviço', to: '/service-orders' },
  { label: 'Despesas', to: '/expenses' },
  { label: 'Produção', to: '/production' },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={[
        'flex h-full flex-col border-r border-brand-100 bg-white/90 shadow-sm transition-all',
        collapsed ? 'gap-3 px-2 py-4' : 'gap-5 px-4 py-6',
      ].join(' ')}
    >
      <div className={`flex w-full items-center ${collapsed ? 'flex-col gap-2' : 'justify-between gap-3'}`}>
        <Link to="/" className="group text-left" title="Ir para Home">
          {collapsed ? (
            <p className="text-lg font-semibold text-brand-800 transition group-hover:text-brand-600">BD</p>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.6em] text-brand-400 transition group-hover:text-brand-500">Hub</p>
              <p className="text-lg font-semibold text-brand-800 transition group-hover:text-brand-600">Bella Design</p>
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg border border-brand-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 transition hover:bg-brand-50"
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {collapsed ? '⟩' : '⟨'}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              [
                'flex items-center rounded-xl text-sm font-medium transition text-left',
                collapsed ? 'px-2 py-2 text-xs' : 'px-4 py-3',
                isActive
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'text-brand-500 hover:bg-brand-50 hover:text-brand-800',
              ].join(' ')
            }
          >
            {collapsed ? (
              <>
                <span aria-hidden>{item.label.slice(0, 1)}</span>
                <span className="sr-only">{item.label}</span>
              </>
            ) : (
              item.label
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-[10px] text-brand-300">
        {collapsed ? 'Menu' : 'Bella Design Hub'}
      </div>
    </aside>
  )
}
