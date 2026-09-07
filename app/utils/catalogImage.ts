export function catalogImage(src: string, width = 400) {
  if (!src.startsWith("https://fakestoreapi.com/")) {
    return src;
  }

  const params = new URLSearchParams({
    src,
    w: String(width),
  });

  return `/img?${params.toString()}`;
}
