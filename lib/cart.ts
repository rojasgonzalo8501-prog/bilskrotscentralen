"use client";

export interface CartItem {
  partId: string;
  sku: string;
  name: string;
  priceSek: number;
  quantity: number;
  imageUrl?: string;
}

const CART_KEY = "merca_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find((i) => i.partId === item.partId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(partId: string): void {
  saveCart(getCart().filter((i) => i.partId !== partId));
}

export function clearCart(): void {
  saveCart([]);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceSek * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
