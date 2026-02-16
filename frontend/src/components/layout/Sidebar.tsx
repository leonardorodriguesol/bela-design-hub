import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Financeiro', to: '/finance' },
  { label: 'Clientes', to: '/customers' },
  { label: 'Pedidos', to: '/orders' },
  { label: 'Despesas', to: '/expenses' },
  { label: 'Produção', to: '/production' },
]

export const Sidebar = () => {
  return (
    <aside className="flex h-full flex-col gap-6 border-r border-brand-100 bg-white/90 px-6 py-8 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-brand-400">Hub</p>
        <p className="text-xl font-semibold text-brand-800">Bella Design</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'text-brand-500 hover:bg-brand-50 hover:text-brand-800',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  )
}
