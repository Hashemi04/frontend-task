import type { Product } from "~/types/product";
import { catalogImageUrl } from "~/utils/catalogImage";
import { isProductAvailable } from "~/utils/fakeStore";

export function productAvailabilityUrl(available: boolean) {
  return available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export function itemListJsonLd(
  origin: string,
  products: Array<{ id: number; title: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${origin}/products/${product.id}`,
      name: product.title,
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
    name: product.title,
    image: catalogImageUrl(origin, product.id, 640),
    description: product.description,
    sku: String(product.id),
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: productAvailabilityUrl(available),
      url: `${origin}/products/${product.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
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
