"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { addToWishlist, removeFromWishlist, syncWishlistToDb } from "@/lib/actions/wishlist";

const WISHLIST_KEY = "polysto-wishlist";

// ═══════════════════════════════════════════
// Auth helpers (Supabase Auth)
// ═══════════════════════════════════════════

/** Get current user (client-side) */
export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Check if user is logged in (sync check from session cache) */
export async function isLoggedIn(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

/** Get user profile from profiles table */
export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? { ...profile, email: user.email } : null;
}

/** Listen to auth state changes */
export function onAuthChange(callback: (user: User | null) => void) {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );
  return subscription;
}

/** Sign out (client-side) */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.dispatchEvent(new Event("auth-updated"));
}

// ═══════════════════════════════════════════
// Wishlist (localStorage — works without auth)
// ═══════════════════════════════════════════

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(WISHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleWishlist(productId: string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  const added = idx < 0;
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(productId);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));

  // Fire-and-forget DB sync when logged in (server action will early-return
  // with { error } if the user isn't authenticated, which we ignore).
  isLoggedIn()
    .then((logged) => {
      if (!logged) return;
      const action = added ? addToWishlist(productId) : removeFromWishlist(productId);
      return action;
    })
    .catch(() => {});

  return added; // true = added, false = removed
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().includes(productId);
}

/**
 * After a successful login, push any locally-stored wishlist entries up to the
 * database and then clear the local cache so the DB becomes the source of truth.
 */
export async function migrateWishlistToDb(): Promise<void> {
  if (typeof window === "undefined") return;
  const local = getWishlist();
  if (local.length === 0) return;

  const logged = await isLoggedIn();
  if (!logged) return;

  const res = await syncWishlistToDb(local);
  if (!res.error) {
    localStorage.removeItem(WISHLIST_KEY);
    window.dispatchEvent(new Event("wishlist-updated"));
  }
}
