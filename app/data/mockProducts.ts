import type { Category, Product } from '~/types/product'

export const mockCategories: Category[] = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
]

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    price: 64,
    description:
      'USB 3.0 and USB 2.0 compatibility. Fast data transfers. Improve PC performance. High capacity.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png',
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 3,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description:
      'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean\'s pearl.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 4,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description:
      '95% RAYON 5% SPANDEX. Made in USA or Imported. Lightweight fabric with great stretch for comfort.',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png',
    rating: { rate: 4.7, count: 130 },
  },
]
