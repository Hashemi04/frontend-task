import { describe, expect, it } from "vitest";
import type { Product } from "../../app/types/product";
import {
  PAGE_SIZE,
  filterProducts,
  paginate,
} from "../../app/utils/productQuery";
import { isProductAvailable } from "../../app/utils/fakeStore";

function product(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    price: id * 10,
    description: `Description ${id}`,
    category: "electronics",
    image: `https://example.test/${id}.jpg`,
    rating: { rate: 3, count: id },
    ...overrides,
  };
}

const catalog: Product[] = [
  product(1, { title: "Blue Backpack", rating: { rate: 4.5, count: 30 } }),
  product(2, {
    title: "Gold Ring",
    category: "jewelery",
    rating: { rate: 2.5, count: 10 },
  }),
  product(3, {
    title: "Red Jacket",
    category: "men's clothing",
    rating: { rate: 4.9, count: 20 },
  }),
  product(4, { title: "Backpack Cover", rating: { rate: 1.5, count: 40 } }),
];

const base = {
  query: "",
  categories: [] as string[],
  available: false,
  sort: "count-asc" as const,
};

describe("filterProducts", () => {
  it("returns the whole catalog sorted by the default key", () => {
    const result = filterProducts(catalog, base, isProductAvailable);
    expect(result.map((p) => p.id)).toEqual([2, 3, 1, 4]);
  });

  it("matches the title case-insensitively and ignores surrounding space", () => {
    const result = filterProducts(
      catalog,
      { ...base, query: "  backPACK " },
      isProductAvailable,
    );
    expect(result.map((p) => p.id)).toEqual([1, 4]);
  });

  it("does not match on description or category", () => {
    expect(
      filterProducts(
        catalog,
        { ...base, query: "jewelery" },
        isProductAvailable,
      ),
    ).toEqual([]);
  });

  it("treats multiple categories as OR", () => {
    const result = filterProducts(
      catalog,
      { ...base, categories: ["jewelery", "men's clothing"] },
      isProductAvailable,
    );
    expect(result.map((p) => p.id)).toEqual([2, 3]);
  });

  it("combines search, category and availability as AND", () => {
    const result = filterProducts(
      catalog,
      {
        ...base,
        query: "backpack",
        categories: ["electronics"],
        available: true,
      },
      isProductAvailable,
    );
    expect(result.map((p) => p.id)).toEqual([1]);
  });

  it("applies each sort key", () => {
    const ids = (sort: (typeof base)["sort"]) =>
      filterProducts(catalog, { ...base, sort }, isProductAvailable).map(
        (p) => p.id,
      );

    expect(ids("count-asc")).toEqual([2, 3, 1, 4]);
    expect(ids("count-desc")).toEqual([4, 1, 3, 2]);
    expect(ids("rating-asc")).toEqual([4, 2, 1, 3]);
    expect(ids("rating-desc")).toEqual([3, 1, 2, 4]);
  });

  it("does not mutate the input array", () => {
    const input = [...catalog];
    filterProducts(input, { ...base, sort: "rating-desc" }, isProductAvailable);
    expect(input.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 20 }, (_, i) => i + 1);

  it("slices the requested page", () => {
    expect(paginate(items, 2, 9)).toMatchObject({
      page: 2,
      totalPages: 3,
      items: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    });
  });

  it("clamps a page past the end to the last page", () => {
    expect(paginate(items, 99, 9)).toMatchObject({ page: 3, totalPages: 3 });
  });

  it("reports one page for an empty list rather than zero", () => {
    expect(paginate([], 1, 9)).toEqual({ page: 1, totalPages: 1, items: [] });
  });

  it("defaults to the catalog page size", () => {
    expect(paginate(items, 1).items).toHaveLength(PAGE_SIZE);
  });
});
