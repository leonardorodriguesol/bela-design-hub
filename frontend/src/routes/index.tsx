import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '../components/layout/RootLayout'
import { Home } from '../pages/home'
import { Finance } from '../pages/finance'
import { Customers } from '../pages/customers'
import { Orders } from '../pages/orders'
import { ServiceOrders } from '../pages/service-orders'
import { Expenses } from '../pages/expenses'
import { Production } from '../pages/production'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'finance', element: <Finance /> },
      { path: 'customers', element: <Customers /> },
      { path: 'orders', element: <Orders /> },
      { path: 'service-orders', element: <ServiceOrders /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'production', element: <Production /> },
    ],
  },
])
