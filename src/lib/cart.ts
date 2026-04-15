"use client";

import { OrderItem } from "./database.types";

const CART_KEY = "polysto-cart";

export function getCart(): OrderItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addToCart(item: OrderItem): OrderItem[] {
  const cart = getCart();
  const existing = cart.find(
    (i) =>
      i.product_id === item.product_id &&
      i.variant === item.variant &&
      i.color === item.color
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return cart;
}

export function updateCartItem(
  index: number,
  quantity: number
): OrderItem[] {
  const cart = getCart();
  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  return cart;
}

export function removeFromCart(index: number): OrderItem[] {
  return updateCartItem(index, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCartTotal(cart: OrderItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const CHECKOUT_KEY = "nha-tao-checkout";

export function setCheckoutItems(items: OrderItem[]): void {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
}

export function getCheckoutItems(): OrderItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHECKOUT_KEY);
  return raw ? JSON.parse(raw) : [];
}
