import { createBrowserRouter, Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Home } from '../pages/home'
import { Finance } from '../pages/finance'
import { Customers } from '../pages/customers'
import { Orders } from '../pages/orders'
import { Expenses } from '../pages/expenses'

const RootLayout = () => (
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'finance', element: <Finance /> },
      { path: 'customers', element: <Customers /> },
      { path: 'orders', element: <Orders /> },
      { path: 'expenses', element: <Expenses /> },
    ],
  },
])
