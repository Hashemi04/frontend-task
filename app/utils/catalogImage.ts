export const CATALOG_IMAGE_WIDTHS = [400, 640, 1000] as const;
export type CatalogImageWidth = (typeof CATALOG_IMAGE_WIDTHS)[number];

export function snapCatalogWidth(width?: number): CatalogImageWidth {
  if (width == null || !Number.isFinite(width) || width <= 400) {
    return 400;
  }

  if (width <= 640) {
    return 640;
  }

  return 1000;
}

export function catalogImagePath(productId: number, width?: number) {
  return `/images/p/${productId}-${snapCatalogWidth(width)}.webp`;
}

export function catalogImageUrl(
  origin: string,
  productId: number,
  width?: number,
) {
  return `${origin.replace(/\/$/, "")}${catalogImagePath(productId, width)}`;
}

export function parseCatalogImageSrc(src: string) {
  const id = Number(src.replace(/^\/+/u, ""));
  if (!Number.isInteger(id) || id < 1) {
    throw new Error(`Invalid catalog image src: ${src}`);
  }

  return id;
}
