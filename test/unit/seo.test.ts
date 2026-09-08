import { describe, expect, it } from "vitest";
import type { Product } from "../../app/types/product";
import {
  breadcrumbJsonLd,
  defaultPriceValidUntil,
  itemListJsonLd,
  productAvailabilityUrl,
  productJsonLd,
} from "../../app/utils/seo";

const product: Product = {
  id: 2,
  title: "Bag",
  price: 10.5,
  description: "A bag",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/bag.png",
  rating: { rate: 3.9, count: 120 },
};

describe("productAvailabilityUrl", () => {
  it("matches the odd-id stock stand-in used in the UI", () => {
    expect(productAvailabilityUrl(true)).toBe("https://schema.org/InStock");
    expect(productAvailabilityUrl(false)).toBe("https://schema.org/OutOfStock");
  });
});

describe("itemListJsonLd", () => {
  it("lists only the products passed in (the visible page)", () => {
    const json = itemListJsonLd("https://shop.test", [
      { ...product, id: 8, title: "Ring" },
      { ...product, id: 1, title: "Bag" },
    ]);
    expect(json.itemListElement).toHaveLength(2);
    expect(json.itemListElement[0]).toMatchObject({
      position: 1,
      item: {
        "@id": "https://shop.test/products/8",
        url: "https://shop.test/products/8",
        name: "Ring",
      },
    });
  });

  it("carries the price so the grid and the markup agree", () => {
    const json = itemListJsonLd("https://shop.test", [product]);
    expect(json.itemListElement[0]!.item.offers).toMatchObject({
      price: "10.50",
      priceCurrency: "USD",
    });
  });
});

describe("productJsonLd", () => {
  it("uses the same-origin catalog image and UI availability", () => {
    const json = productJsonLd("https://shop.test", product, false);
    expect(json.image).toBe("https://shop.test/images/p/2-640.webp");
    expect(json.offers.availability).toBe("https://schema.org/OutOfStock");
    expect(json.offers.url).toBe("https://shop.test/products/2");
  });

  it("emits the offer fields Google asks for", () => {
    const json = productJsonLd("https://shop.test", product, true);
    expect(json.offers).toMatchObject({
      "@type": "Offer",
      price: "10.50",
      priceCurrency: "USD",
      itemCondition: "https://schema.org/NewCondition",
    });
    expect(json.offers.priceValidUntil).toMatch(/^\d{4}-12-31$/);
  });

  it("omits brand rather than inventing one Fake Store does not provide", () => {
    expect(productJsonLd("https://shop.test", product)).not.toHaveProperty(
      "brand",
    );
  });

  it("bounds the rating so reviewCount is interpretable", () => {
    const json = productJsonLd("https://shop.test", product);
    expect(json.aggregateRating).toMatchObject({
      ratingValue: 3.9,
      reviewCount: 120,
      bestRating: 5,
      worstRating: 1,
    });
  });
});

describe("defaultPriceValidUntil", () => {
  it("is stable for a whole year so prerendered markup does not churn", () => {
    expect(defaultPriceValidUntil(new Date("2026-01-02T00:00:00Z"))).toBe(
      "2027-12-31",
    );
    expect(defaultPriceValidUntil(new Date("2026-11-30T00:00:00Z"))).toBe(
      "2027-12-31",
    );
  });
});

describe("breadcrumbJsonLd", () => {
  it("includes home, catalog, and the product", () => {
    const json = breadcrumbJsonLd("https://shop.test", product);
    expect(json.itemListElement.map((item) => item.item)).toEqual([
      "https://shop.test/",
      "https://shop.test/",
      "https://shop.test/products/2",
    ]);
  });
});
