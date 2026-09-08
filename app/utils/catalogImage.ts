const STATIC_WIDTHS = new Set([400, 640, 1000]);

export function catalogImage(src: string, width = 400, productId?: number) {
  if (productId != null && !import.meta.dev && STATIC_WIDTHS.has(width)) {
    return `/images/p/${productId}-${width}.webp`;
  }

  if (!src.startsWith("https://fakestoreapi.com/")) {
    return src;
  }

  const params = new URLSearchParams({
    src,
    w: String(width),
  });

  return `/img?${params.toString()}`;
}
