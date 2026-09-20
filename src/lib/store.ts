import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { AuthUser, ProgressEntry, WatchlistEntry } from "./types";

/* Local cache + pub/sub layer so React components can subscribe
   synchronously, while the cache itself is kept live by Firestore
   listeners (for watchlist/progress) or Firebase Auth (for the user). */

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

/** Signs out of Firebase and clears cached user + list/progress data. */
export async function signOutUser() {
  await signOut(auth);
  write<AuthUser | null>(AUTH_KEY, null);
  write<WatchlistEntry[]>(WATCHLIST_KEY, []);
  write<ProgressEntry[]>(PROGRESS_KEY, []);
}

/* ---------------- Firestore-synced watchlist + progress ----------------
   Local cache mirrors two Firestore collections:
     users/{uid}/watchlist/{animeId}
     users/{uid}/progress/{animeId}
   A live listener keeps the cache (and therefore hooks) fresh. Both are
   signed-in-only: no user, no data, and writes are rejected client-side. */

let unsubWatchlist: (() => void) | null = null;
let unsubProgress: (() => void) | null = null;

function attachUserListeners(uid: string) {
  unsubWatchlist?.();
  unsubProgress?.();

  unsubWatchlist = onSnapshot(collection(db, "users", uid, "watchlist"), (snap) => {
    write(
      WATCHLIST_KEY,
      snap.docs.map((d) => d.data() as WatchlistEntry),
    );
  });

  unsubProgress = onSnapshot(collection(db, "users", uid, "progress"), (snap) => {
    write(
      PROGRESS_KEY,
      snap.docs.map((d) => d.data() as ProgressEntry),
    );
  });
}

function detachUserListeners() {
  unsubWatchlist?.();
  unsubProgress?.();
  unsubWatchlist = null;
  unsubProgress = null;
  write<WatchlistEntry[]>(WATCHLIST_KEY, []);
  write<ProgressEntry[]>(PROGRESS_KEY, []);
}

/* Keep the cached user + list/progress data in sync with real Firebase
   session state — runs once on startup and again on every future
   sign-in/out, so refreshing the page doesn't log the user out. */
onAuthStateChanged(auth, (fbUser) => {
  if (fbUser) {
    write<AuthUser | null>(AUTH_KEY, {
      uid: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
      email: fbUser.email || "",
      photoURL: fbUser.photoURL,
    });
    attachUserListeners(fbUser.uid);
  } else {
    write<AuthUser | null>(AUTH_KEY, null);
    detachUserListeners();
  }
});

/* ---------------- watchlist / "My List" ---------------- */
export function getWatchlist(): WatchlistEntry[] {
  return read<WatchlistEntry[]>(WATCHLIST_KEY, []).sort((a, b) => b.addedAt - a.addedAt);
}

export function isInWatchlist(animeId: number): boolean {
  return read<WatchlistEntry[]>(WATCHLIST_KEY, []).some((w) => w.animeId === animeId);
}

export function useWatchlist(): WatchlistEntry[] {
  const [state, setState] = useState<WatchlistEntry[]>(() => getWatchlist());
  useEffect(() => subscribe(WATCHLIST_KEY, () => setState(getWatchlist())), []);
  return state;
}

export type ToggleResult = { requiresAuth: true } | { requiresAuth: false; added: boolean };

/** Adds/removes an anime from the signed-in user's watchlist in Firestore.
 *  Returns `{ requiresAuth: true }` when nobody is signed in — callers
 *  should open the auth modal in that case instead of writing anything. */
export async function toggleWatchlist(entry: Omit<WatchlistEntry, "addedAt">): Promise<ToggleResult> {
  const uid = auth.currentUser?.uid;
  if (!uid) return { requiresAuth: true };

  const exists = isInWatchlist(entry.animeId);
  const ref = doc(db, "users", uid, "watchlist", String(entry.animeId));
  if (exists) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { ...entry, addedAt: Date.now() });
  }
  return { requiresAuth: false, added: !exists };
}

/** Hard-removes an anime from the watchlist — used when a show is finished. */
export async function removeFromWatchlist(animeId: number) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(doc(db, "users", uid, "watchlist", String(animeId)));
}

/* ---------------- continue watching progress ---------------- */
export function getProgress(): ProgressEntry[] {
  return read<ProgressEntry[]>(PROGRESS_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function useProgress(): ProgressEntry[] {
  const [state, setState] = useState<ProgressEntry[]>(() => getProgress());
  useEffect(() => subscribe(PROGRESS_KEY, () => setState(getProgress())), []);
  return state;
}

/** Saves watch progress for the signed-in user. No-ops if signed out —
 *  continue-watching is a signed-in perk, same as the watchlist. */
export async function saveProgress(entry: ProgressEntry) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(doc(db, "users", uid, "progress", String(entry.animeId)), entry);
}

export async function removeProgress(animeId: number) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(doc(db, "users", uid, "progress", String(animeId)));
}