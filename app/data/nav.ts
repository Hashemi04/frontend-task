export const PHONE_HREF = 'tel:+982100000000'

export const navItems = [
  { to: '/', label: 'لیست محصولات', icon: 'products' },
  { to: '/consultation', label: 'دریافت مشاوره', icon: 'consultation' },
  { to: '/faq', label: 'سوالات متداول', icon: 'faq' },
  { to: '/contact', label: 'تماس با ما', icon: 'contact' },
] as const

export type NavIconName = (typeof navItems)[number]['icon']
