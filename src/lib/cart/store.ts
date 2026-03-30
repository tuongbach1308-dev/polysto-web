'use client'

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  qty: number
}

const CART_KEY = 'poly_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch { return [] }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const cart = getCart()
  const existing = cart.find(i => i.id === item.id)
  if (existing) {
    existing.qty += qty
  } else {
    cart.push({ ...item, qty })
  }
  saveCart(cart)
}

export function updateCartQty(id: string, qty: number) {
  const cart = getCart().map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
  saveCart(cart)
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter(i => i.id !== id))
}

export function clearCart() {
  saveCart([])
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0)
}
