/**
 * The four categories Fake Store actually returns. The API is not
 * contractually limited to them, so `Category` keeps autocomplete for the
 * known names while still accepting anything new the API starts sending.
 */
export const KNOWN_CATEGORIES = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
] as const;

export type KnownCategory = (typeof KNOWN_CATEGORIES)[number];
export type Category = KnownCategory | (string & {});

export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: ProductRating;
}
