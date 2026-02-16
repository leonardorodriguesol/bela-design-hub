import { Outlet } from 'react-router-dom'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const RootLayout = () => (
  <div className="grid min-h-screen grid-cols-[260px_1fr] bg-brand-50 text-brand-900">
    <Sidebar />
    <div className="flex min-h-screen flex-col bg-brand-50/70">
      <Header />
      <main className="flex-1 overflow-y-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  </div>
)
