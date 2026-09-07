import type { Product } from '~/types/product'
import {
  FAKE_STORE_PRODUCTS_URL,
  parseProductList,
} from '~/utils/fakeStore'

export default defineCachedEventHandler(
  async (): Promise<Product[]> => {
    const payload = await $fetch<unknown>(FAKE_STORE_PRODUCTS_URL)
    return parseProductList(payload)
  },
  { maxAge: 60 * 10, swr: true, name: 'catalog' },
)
