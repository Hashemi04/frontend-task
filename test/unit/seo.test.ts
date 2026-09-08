import { describe, expect, it } from "vitest";
import type { Product } from "../../app/types/product";
import {
  breadcrumbJsonLd,
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
      { id: 8, title: "Ring" },
      { id: 1, title: "Bag" },
    ]);
    expect(json.itemListElement).toHaveLength(2);
    expect(json.itemListElement[0]).toMatchObject({
      position: 1,
      url: "https://shop.test/products/8",
      name: "Ring",
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
