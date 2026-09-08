import type { Product } from "~/types/product";
import { catalogImageUrl } from "~/utils/catalogImage";
import { isProductAvailable } from "~/utils/fakeStore";

export const PRICE_CURRENCY = "USD";

export function productAvailabilityUrl(available: boolean) {
  return available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

/**
 * Google wants an offer to say how long the price is good for. Fake Store has
 * no such field, so this resolves to the end of next year: far enough out to
 * stay valid, stable enough that prerendered markup does not change daily.
 */
export function defaultPriceValidUntil(now = new Date()) {
  return `${now.getUTCFullYear() + 1}-12-31`;
}

export function productOffer(
  origin: string,
  product: Product,
  available = isProductAvailable(product),
) {
  return {
    "@type": "Offer",
    price: product.price.toFixed(2),
    priceCurrency: PRICE_CURRENCY,
    priceValidUntil: defaultPriceValidUntil(),
    itemCondition: "https://schema.org/NewCondition",
    availability: productAvailabilityUrl(available),
    url: `${origin}/products/${product.id}`,
  };
}

export function itemListJsonLd(origin: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${origin}/products/${product.id}`,
        url: `${origin}/products/${product.id}`,
        name: product.title,
        image: [catalogImageUrl(origin, product.id, 400), product.image],
        category: product.category,
        offers: productOffer(origin, product),
      },
    })),
  };
}

export function productJsonLd(
  origin: string,
  product: Product,
  available = isProductAvailable(product),
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${origin}/products/${product.id}`,
    url: `${origin}/products/${product.id}`,
    name: product.title,
    image: [catalogImageUrl(origin, product.id, 640), product.image],
    description: product.description,
    sku: String(product.id),
    category: product.category,
    // No `brand`: Fake Store has no brand field and inventing one would put
    // a claim in structured data that the source data does not support.
    offers: productOffer(origin, product, available),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function breadcrumbJsonLd(origin: string, product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: `${origin}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "لیست محصولات",
        item: `${origin}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${origin}/products/${product.id}`,
      },
    ],
  };
}
