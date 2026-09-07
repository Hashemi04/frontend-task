import { describe, expect, it } from "vitest";
import {
  CATALOG_CATEGORIES,
  catalogCategories,
  isProduct,
  parseProduct,
  parseProductId,
  parseProductList,
} from "../../app/utils/fakeStore";

const valid = {
  id: 1,
  title: "Bag",
  price: 10.5,
  description: "A bag",
  category: "men's clothing",
  image: "https://example.com/bag.png",
  rating: { rate: 3.9, count: 120 },
};

describe("parseProductId", () => {
  it("accepts a positive integer string", () => {
    expect(parseProductId("12")).toBe(12);
  });

  it("rejects missing, non-integer, and padded values", () => {
    expect(parseProductId(undefined)).toBeNull();
    expect(parseProductId("")).toBeNull();
    expect(parseProductId("1.5")).toBeNull();
    expect(parseProductId("abc")).toBeNull();
    expect(parseProductId("01")).toBeNull();
    expect(parseProductId("-1")).toBeNull();
  });
});

describe("isProduct / parseProduct", () => {
  it("accepts a Fake Store shaped product", () => {
    expect(isProduct(valid)).toBe(true);
    expect(parseProduct(valid)).toEqual(valid);
  });

  it("treats null and garbage as missing, not a network error", () => {
    expect(parseProduct(null)).toBeNull();
    expect(parseProduct({})).toBeNull();
    expect(parseProduct({ id: 1, title: "nope" })).toBeNull();
  });
});

describe("parseProductList", () => {
  it("returns valid products from an array", () => {
    expect(parseProductList([valid, { id: 2 }])).toEqual([valid]);
  });

  it("allows an empty catalog", () => {
    expect(parseProductList([])).toEqual([]);
  });

  it("throws when the payload is not an array", () => {
    expect(() => parseProductList(null)).toThrow();
    expect(() => parseProductList({ id: 1 })).toThrow();
  });

  it("throws when every row is garbage", () => {
    expect(() => parseProductList([{}, { foo: 1 }])).toThrow();
  });
});

describe("catalogCategories", () => {
  it("keeps Fake Store order and drops names the catalog does not have", () => {
    expect(
      catalogCategories([{ ...valid, category: "jewelery" }]),
    ).toEqual(["jewelery"]);
  });

  it("keeps the full order when every known category is present", () => {
    const products = CATALOG_CATEGORIES.map((category, id) => ({
      ...valid,
      id: id + 1,
      category,
    }));
    expect(catalogCategories(products)).toEqual([...CATALOG_CATEGORIES]);
  });
});
