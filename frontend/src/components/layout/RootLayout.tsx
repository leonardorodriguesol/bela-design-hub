import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const gridTemplate = collapsed ? 'grid-cols-[84px_1fr]' : 'grid-cols-[260px_1fr]'

  return (
    <div className={`grid min-h-screen ${gridTemplate} bg-brand-50 text-brand-900 transition-[grid-template-columns]`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((state) => !state)} />
      <div className="flex min-h-screen flex-col bg-brand-50/70">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
