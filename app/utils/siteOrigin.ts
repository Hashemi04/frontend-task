export function useSiteOrigin() {
  const url = useRequestURL()

  if (import.meta.client) {
    return window.location.origin
  }

  const hostname = url.hostname
  if (
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    !url.port
  ) {
    return `${url.protocol}//${hostname}:3000`
  }

  return url.origin
}
