import { FetchError } from 'ofetch'
import {
  FAKE_STORE_PRODUCTS_URL,
  parseProduct,
  parseProductList,
} from '~/utils/fakeStore'

export function useCatalogProducts() {
  return useAsyncData('products', async () => {
    const payload = await $fetch<unknown>(FAKE_STORE_PRODUCTS_URL)
    return parseProductList(payload)
  })
}

export function useProductById(id: number) {
  return useAsyncData(`product-${id}`, async () => {
    try {
      const payload = await $fetch<unknown>(`${FAKE_STORE_PRODUCTS_URL}/${id}`)
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
