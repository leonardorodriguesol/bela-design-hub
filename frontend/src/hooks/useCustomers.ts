import { useQuery } from '@tanstack/react-query'

import { customersApi } from '../api/customers'

export const useCustomers = () => {
  return useQuery({ queryKey: ['customers'], queryFn: customersApi.list })
}
