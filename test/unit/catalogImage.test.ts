import { describe, expect, it } from "vitest";
import {
  catalogImagePath,
  catalogImageUrl,
  parseCatalogImageSrc,
  snapCatalogWidth,
} from "../../app/utils/catalogImage";

describe("snapCatalogWidth", () => {
  it("maps requested widths onto the generated 400/640/1000 set", () => {
    expect(snapCatalogWidth(undefined)).toBe(400);
    expect(snapCatalogWidth(280)).toBe(400);
    expect(snapCatalogWidth(400)).toBe(400);
    expect(snapCatalogWidth(401)).toBe(640);
    expect(snapCatalogWidth(800)).toBe(1000);
    expect(snapCatalogWidth(1600)).toBe(1000);
  });
});

describe("catalogImagePath", () => {
  it("builds the static WebP path for a product id", () => {
    expect(catalogImagePath(8, 400)).toBe("/images/p/8-400.webp");
    expect(catalogImagePath(1, 720)).toBe("/images/p/1-1000.webp");
  });
});

describe("catalogImageUrl", () => {
  it("prefixes origin without a double slash", () => {
    expect(catalogImageUrl("http://127.0.0.1:3001/", 3, 640)).toBe(
      "http://127.0.0.1:3001/images/p/3-640.webp",
    );
  });
});

describe("parseCatalogImageSrc", () => {
  it("accepts a numeric id", () => {
    expect(parseCatalogImageSrc("12")).toBe(12);
    expect(parseCatalogImageSrc("/12")).toBe(12);
  });

  it("rejects garbage", () => {
    expect(() => parseCatalogImageSrc("/img/foo.png")).toThrow();
  });
});
