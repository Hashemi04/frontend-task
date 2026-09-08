import { describe, expect, it } from "vitest";
import {
  catalogIds,
  CATALOG_PAGE_SIZE,
  readCatalogFixture,
} from "../../build/catalog";
import { PAGE_SIZE, catalogPagePath } from "../../app/utils/productQuery";

describe("catalog fixture", () => {
  const fixture = readCatalogFixture();

  it("is a usable offline snapshot of the Fake Store catalog", () => {
    expect(Array.isArray(fixture)).toBe(true);
    expect(fixture.length).toBeGreaterThan(0);
  });

  it("yields product ids the prerenderer can turn into routes", () => {
    const ids = catalogIds(fixture);
    expect(ids.length).toBe(fixture.length);
    expect(ids.every((id) => Number.isInteger(id) && id > 0)).toBe(true);
  });

  it("covers every paginated catalog URL the fixture implies", () => {
    expect(PAGE_SIZE).toBe(CATALOG_PAGE_SIZE);

    const totalPages = Math.ceil(catalogIds(fixture).length / PAGE_SIZE);
    const paths = Array.from({ length: totalPages }, (_, i) =>
      catalogPagePath(i + 1),
    );

    expect(paths[0]).toBe("/");
    expect(paths.slice(1)).toEqual(
      Array.from({ length: totalPages - 1 }, (_, i) => `/page/${i + 2}`),
    );
  });
});

describe("catalogIds", () => {
  it("ignores rows without a usable id", () => {
    expect(
      catalogIds([{ id: 3 }, { id: "4" }, { id: 0 }, { id: -1 }, {}, null, 7]),
    ).toEqual([3, 4]);
  });

  it("returns nothing for a non-array payload", () => {
    expect(catalogIds({ products: [] })).toEqual([]);
    expect(catalogIds(null)).toEqual([]);
  });
});
