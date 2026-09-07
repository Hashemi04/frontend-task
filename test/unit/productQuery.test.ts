import { describe, expect, it } from "vitest";
import {
  CATALOG_PATH,
  DEFAULT_SORT,
  applyQueryUpdates,
  catalogQuerySource,
  clampPage,
  parseAppliedSort,
  parseCategories,
  parsePage,
  parseSort,
} from "../../app/utils/productQuery";

const allowed = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

describe("parseSort", () => {
  it("uses count-asc when sort is missing", () => {
    expect(parseSort(undefined)).toBe(DEFAULT_SORT);
    expect(parseSort("")).toBe("count-asc");
  });

  it("falls back to count-asc for unknown keys", () => {
    expect(parseSort("price-asc")).toBe("count-asc");
  });

  it("accepts a valid sort key", () => {
    expect(parseSort("rating-desc")).toBe("rating-desc");
  });
});

describe("parseAppliedSort", () => {
  it("is null when the URL has no sort (implicit default is not a chip)", () => {
    expect(parseAppliedSort(undefined)).toBeNull();
    expect(parseAppliedSort("nope")).toBeNull();
  });

  it("returns the key when sort is explicit", () => {
    expect(parseAppliedSort("count-asc")).toBe("count-asc");
  });
});

describe("parsePage", () => {
  it("defaults invalid values to 1", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("2.5")).toBe(1);
  });

  it("reads a positive integer", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage(["4", "9"])).toBe(4);
  });
});

describe("clampPage", () => {
  it("caps a requested page to the last page", () => {
    expect(clampPage(99, 3)).toBe(3);
  });
});

describe("parseCategories", () => {
  it("returns an empty list when missing", () => {
    expect(parseCategories(undefined, allowed)).toEqual([]);
  });

  it("keeps known names and drops the rest", () => {
    expect(
      parseCategories("electronics, junk, jewelery", allowed),
    ).toEqual(["electronics", "jewelery"]);
  });

  it("trims tokens", () => {
    expect(parseCategories(" electronics ", allowed)).toEqual(["electronics"]);
  });
});

describe("catalogQuerySource", () => {
  it("keeps catalog query when already on the list", () => {
    expect(
      catalogQuerySource(CATALOG_PATH, { q: "hat", page: "2" }),
    ).toEqual({ q: "hat", page: "2" });
  });

  it("starts empty when committing search from another route", () => {
    expect(
      catalogQuerySource("/products/1", { anything: "nope" }),
    ).toEqual({});
  });
});

describe("applyQueryUpdates", () => {
  it("drops page when a filter changes", () => {
    expect(
      applyQueryUpdates({ q: "hat", page: "3" }, { q: "jacket" }),
    ).toEqual({ q: "jacket" });
  });

  it("keeps page when the update is the page itself", () => {
    expect(
      applyQueryUpdates({ q: "hat", page: "1" }, { page: "2" }),
    ).toEqual({ q: "hat", page: "2" });
  });

  it("omits page 1 from the URL", () => {
    expect(
      applyQueryUpdates({ q: "hat", page: "2" }, { page: undefined }),
    ).toEqual({ q: "hat" });
  });
});
