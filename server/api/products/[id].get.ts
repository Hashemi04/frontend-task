import { FetchError } from 'ofetch'
import type { Product } from '~/types/product'
import { FAKE_STORE_PRODUCTS_URL, parseProduct } from '~/utils/fakeStore'

export default defineCachedEventHandler(
  async (event): Promise<Product> => {
    const id = Number(getRouterParam(event, 'id'))
    if (!Number.isInteger(id) || id < 1) {
      throw createError({ statusCode: 404, statusMessage: 'Not Found' })
    }

    try {
      const payload = await $fetch<unknown>(`${FAKE_STORE_PRODUCTS_URL}/${id}`)
      const product = parseProduct(payload)
      if (!product) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' })
      }
      return product
    }
    catch (error) {
      if (error instanceof FetchError && error.statusCode === 404) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' })
      }
      throw error
    }
  },
  { maxAge: 60 * 10, swr: true, name: 'product', getKey: event => getRouterParam(event, 'id') ?? '' },
)
