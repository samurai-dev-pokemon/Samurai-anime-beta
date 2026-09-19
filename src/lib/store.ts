import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import type { AuthUser, ProgressEntry, WatchlistEntry } from "./types";

/* Minimal localStorage-backed store with a pub/sub layer so React
   components can subscribe to changes without extra dependencies. */

const PROGRESS_KEY = "samurai.progress.v1";
const WATCHLIST_KEY = "samurai.watchlist.v1";
const AUTH_KEY = "samurai.auth.v1";

type Listener = () => void;
const listeners: Record<string, Set<Listener>> = {};

function emit(key: string) {
  listeners[key]?.forEach((l) => l());
}

function subscribe(key: string, cb: Listener) {
  listeners[key] = listeners[key] || new Set();
  listeners[key].add(cb);
  return () => {
    listeners[key].delete(cb);
  };
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
  emit(key);
}

/* ---------------- continue watching progress ---------------- */
export function getProgress(): ProgressEntry[] {
  return read<ProgressEntry[]>(PROGRESS_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveProgress(entry: ProgressEntry) {
  const list = read<ProgressEntry[]>(PROGRESS_KEY, []).filter((p) => p.animeId !== entry.animeId);
  list.unshift(entry);
  write(PROGRESS_KEY, list.slice(0, 30));
}

export function removeProgress(animeId: number) {
  const list = read<ProgressEntry[]>(PROGRESS_KEY, []).filter((p) => p.animeId !== animeId);
  write(PROGRESS_KEY, list);
}

export function useProgress(): ProgressEntry[] {
  const [state, setState] = useState<ProgressEntry[]>(() => getProgress());
  useEffect(() => subscribe(PROGRESS_KEY, () => setState(getProgress())), []);
  return state;
}

/* ---------------- watchlist / "My List" ---------------- */
export function getWatchlist(): WatchlistEntry[] {
  return read<WatchlistEntry[]>(WATCHLIST_KEY, []).sort((a, b) => b.addedAt - a.addedAt);
}

export function isInWatchlist(animeId: number): boolean {
  return read<WatchlistEntry[]>(WATCHLIST_KEY, []).some((w) => w.animeId === animeId);
}

export function toggleWatchlist(entry: Omit<WatchlistEntry, "addedAt">) {
  const list = read<WatchlistEntry[]>(WATCHLIST_KEY, []);
  const exists = list.some((w) => w.animeId === entry.animeId);
  const next = exists
    ? list.filter((w) => w.animeId !== entry.animeId)
    : [...list, { ...entry, addedAt: Date.now() }];
  write(WATCHLIST_KEY, next);
  return !exists;
}

export function useWatchlist(): WatchlistEntry[] {
  const [state, setState] = useState<WatchlistEntry[]>(() => getWatchlist());
  useEffect(() => subscribe(WATCHLIST_KEY, () => setState(getWatchlist())), []);
  return state;
}

/* ---------------- auth (backed by Firebase Authentication) ---------------- */
export function getUser(): AuthUser | null {
  return read<AuthUser | null>(AUTH_KEY, null);
}

/** Optimistically set the cached user (e.g. right after sign in/up),
 *  ahead of Firebase's own onAuthStateChanged confirmation below. */
export function setUser(user: AuthUser | null) {
  write(AUTH_KEY, user);
}

export function useUser(): AuthUser | null {
  const [state, setState] = useState<AuthUser | null>(() => getUser());
  useEffect(() => subscribe(AUTH_KEY, () => setState(getUser())), []);
  return state;
}

/** Signs out of Firebase and clears the cached local user. */
export async function signOutUser() {
  await signOut(auth);
  write<AuthUser | null>(AUTH_KEY, null);
}

/* Keep the cached user in sync with real Firebase session state —
   runs once when this module first loads (i.e. on app startup), and
   again on every future sign-in/out, so refreshing the page doesn't
   log the user out. */
onAuthStateChanged(auth, (fbUser) => {
  if (fbUser) {
    write<AuthUser | null>(AUTH_KEY, {
      uid: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
      email: fbUser.email || "",
      photoURL: fbUser.photoURL,
    });
  } else {
    write<AuthUser | null>(AUTH_KEY, null);
  }
});