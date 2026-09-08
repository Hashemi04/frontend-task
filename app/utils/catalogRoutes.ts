const FAKE_STORE_PRODUCTS_URL = "https://fakestoreapi.com/products";

export async function fetchProductPrerenderRoutes() {
  const response = await fetch(FAKE_STORE_PRODUCTS_URL);
  if (!response.ok) {
    throw new Error(`Catalog prerender list failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("Catalog prerender list was empty");
  }

  const routes = payload
    .map((item) =>
      item && typeof item === "object" && "id" in item ? Number(item.id) : NaN,
    )
    .filter((id) => Number.isInteger(id) && id > 0)
    .map((id) => `/products/${id}`);

  if (!routes.length) {
    throw new Error("Catalog prerender list had no product ids");
  }

  return routes;
}
