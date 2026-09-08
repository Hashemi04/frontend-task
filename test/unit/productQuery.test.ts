import { describe, expect, it } from "vitest";
import {
  CATALOG_PATH,
  DEFAULT_SORT,
  appliedFilterCount,
  applyQueryUpdates,
  catalogCanonicalPath,
  catalogPagePath,
  catalogQuerySource,
  catalogRobots,
  clampPage,
  isCatalogPageParam,
  isCatalogPath,
  parseAppliedSort,
  parseAvailable,
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

describe("parseAvailable", () => {
  it("is off unless the URL is available=1", () => {
    expect(parseAvailable(undefined)).toBe(false);
    expect(parseAvailable("")).toBe(false);
    expect(parseAvailable("true")).toBe(false);
    expect(parseAvailable("1")).toBe(true);
  });
});

describe("parseCategories", () => {
  it("returns an empty list when missing", () => {
    expect(parseCategories(undefined, allowed)).toEqual([]);
  });

  it("keeps known names and drops the rest", () => {
    expect(parseCategories("electronics, junk, jewelery", allowed)).toEqual([
      "electronics",
      "jewelery",
    ]);
  });

  it("trims tokens", () => {
    expect(parseCategories(" electronics ", allowed)).toEqual(["electronics"]);
  });
});

describe("isCatalogPath", () => {
  it("accepts the catalog root and its paginated routes", () => {
    expect(isCatalogPath("/")).toBe(true);
    expect(isCatalogPath("/page/2")).toBe(true);
    expect(isCatalogPath("/page/12/")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isCatalogPath("/products/1")).toBe(false);
    expect(isCatalogPath("/page/abc")).toBe(false);
    expect(isCatalogPath("/pages/2")).toBe(false);
  });
});

describe("catalogPagePath", () => {
  it("keeps page 1 on the clean catalog URL", () => {
    expect(catalogPagePath(1)).toBe(CATALOG_PATH);
    expect(catalogPagePath(0)).toBe(CATALOG_PATH);
  });

  it("puts later pages in the path so they are crawlable", () => {
    expect(catalogPagePath(2)).toBe("/page/2");
    expect(catalogPagePath(13)).toBe("/page/13");
  });
});

describe("catalogCanonicalPath / catalogRobots", () => {
  it("self-canonicalises clean paginated URLs", () => {
    expect(catalogCanonicalPath(1, false)).toBe("/");
    expect(catalogCanonicalPath(2, false)).toBe("/page/2");
    expect(catalogRobots(false)).toBeUndefined();
  });

  it("sends filtered views to / with noindex, follow", () => {
    expect(catalogCanonicalPath(2, true)).toBe("/");
    expect(catalogCanonicalPath(1, true)).toBe("/");
    expect(catalogRobots(true)).toBe("noindex, follow");
  });
});

describe("isCatalogPageParam", () => {
  it("accepts 1-based integers without leading zeros", () => {
    expect(isCatalogPageParam("1")).toBe(true);
    expect(isCatalogPageParam("12")).toBe(true);
  });

  it("rejects junk", () => {
    expect(isCatalogPageParam("01")).toBe(false);
    expect(isCatalogPageParam("0")).toBe(false);
    expect(isCatalogPageParam("abc")).toBe(false);
  });
});

describe("catalogQuerySource", () => {
  it("keeps catalog query when already on the list", () => {
    expect(catalogQuerySource(CATALOG_PATH, { q: "hat" })).toEqual({
      q: "hat",
    });
  });

  it("keeps catalog query when on a paginated catalog route", () => {
    expect(catalogQuerySource("/page/3", { q: "hat" })).toEqual({ q: "hat" });
  });

  it("starts empty when committing search from another route", () => {
    expect(catalogQuerySource("/products/1", { anything: "nope" })).toEqual({});
  });
});

describe("applyQueryUpdates", () => {
  it("merges a new filter over the current query", () => {
    expect(applyQueryUpdates({ q: "hat" }, { sort: "rating-desc" })).toEqual({
      q: "hat",
      sort: "rating-desc",
    });
  });

  it("replaces an existing value", () => {
    expect(applyQueryUpdates({ q: "hat" }, { q: "jacket" })).toEqual({
      q: "jacket",
    });
  });

  it("removes a key when the update clears it", () => {
    expect(
      applyQueryUpdates({ q: "hat", available: "1" }, { available: undefined }),
    ).toEqual({ q: "hat" });
  });

  it("does not mutate the input", () => {
    const current = { q: "hat" };
    applyQueryUpdates(current, { q: undefined });
    expect(current).toEqual({ q: "hat" });
  });
});

describe("appliedFilterCount", () => {
  it("counts search, explicit sort, categories, and availability", () => {
    expect(
      appliedFilterCount({
        query: "jacket",
        sort: "rating-desc",
        categories: ["electronics", "jewelery"],
        available: true,
      }),
    ).toBe(5);
  });

  it("ignores implicit default sort and empty search", () => {
    expect(
      appliedFilterCount({
        query: "",
        sort: null,
        categories: [],
        available: false,
      }),
    ).toBe(0);
  });
});
