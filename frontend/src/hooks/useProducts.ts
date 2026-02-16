import { useQuery } from '@tanstack/react-query'

import { productsApi } from '../api/products'

export const useProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: productsApi.list })
}
