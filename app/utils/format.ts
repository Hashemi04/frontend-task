export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)} دلار`;
}

export function formatRating(rate: number) {
  return new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
}

export function formatCount(count: number) {
  return new Intl.NumberFormat("fa-IR").format(count);
}
