import { FetchError } from 'ofetch'
import type { Product } from '~/types/product'
import { parseProduct, parseProductList } from '~/utils/fakeStore'

export function useCatalogProducts() {
  return useAsyncData('products', async () => {
    const payload = await $fetch<unknown>('/api/products')
    return parseProductList(payload)
  })
}

export function useProductById(id: number) {
  return useAsyncData(`product-${id}`, async () => {
    try {
      const payload = await $fetch<unknown>(`/api/products/${id}`)
      return parseProduct(payload)
    }
    catch (error) {
      if (error instanceof FetchError && error.statusCode === 404) {
        return null
      }

      throw error
    }
  })
}

export type { Product }
