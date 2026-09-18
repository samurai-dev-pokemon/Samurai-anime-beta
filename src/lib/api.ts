import type {
  Anime,
  CharacterEntry,
  EpisodeMeta,
  RecommendationEntry,
  StreamingPlatform,
  VideoEntry,
  WatchResult,
} from "./types";

export const API_BASE = "https://anivault-scraper-fawn.vercel.app/api";

/** Genres/keywords that must never appear on this site. */
const BLOCKED_GENRES = new Set([
  "hentai",
  "ecchi",
  "erotica",
  "adult cast",
  "adult",
  "boys love",
  "girls love",
]);

export function isSafe(anime: Pick<Anime, "genres" | "rating">): boolean {
  const genres = (anime.genres || []).map((g) => g.toLowerCase());
  if (genres.some((g) => BLOCKED_GENRES.has(g))) return false;
  const rating = (anime.rating || "").toLowerCase();
  if (rating.includes("rx") || rating.includes("hentai")) return false;
  return true;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

/* ---------------- request coalescing + cache ---------------- */
const animeCache = new Map<number, Anime>();
const inflight = new Map<number, Promise<Anime | null>>();

function seasonToYear(premiered?: string | null): number | undefined {
  const m = /\d{4}/.exec(premiered || "");
  return m ? Number(m[0]) : undefined;
}

function normalizeCombined(malId: number, raw: any): Anime {
  const d = raw?.data ?? raw ?? {};
  return {
    malId,
    title: d.titleEnglish || d.title || `Anime #${malId}`,
    titleEnglish: d.titleEnglish,
    titleJapanese: d.titleJapanese,
    synopsis: d.synopsis,
    poster: d.poster || null,
    cover: d.cover || d.poster || null,
    banner: d.banner || null,
    logo: d.logo || null,
    genres: d.genres || [],
    score: d.score ?? null,
    episodes: d.episodes ?? null,
    year: d.year ?? seasonToYear(d.premiered) ?? null,
    status: d.status ?? null,
    type: d.type ?? null,
    studios: d.studios || [],
    rating: d.rating ?? null,
    duration: d.duration ?? null,
    aired: d.aired ?? null,
  };
}

export async function getAnimeByMalId(malId: number): Promise<Anime | null> {
  if (animeCache.has(malId)) return animeCache.get(malId)!;
  if (inflight.has(malId)) return inflight.get(malId)!;
  const p = (async () => {
    try {
      const raw = await getJSON<any>(`${API_BASE}/anime?malId=${malId}`);
      const anime = normalizeCombined(malId, raw);
      animeCache.set(malId, anime);
      return anime;
    } catch {
      return null;
    } finally {
      inflight.delete(malId);
    }
  })();
  inflight.set(malId, p);
  return p;
}

export function primeAnimeCache(anime: Anime) {
  animeCache.set(anime.malId, anime);
}

/** Fetch many anime by MAL id with bounded concurrency, safe-filtered. */
export async function getAnimeBatch(
  ids: number[],
  { concurrency = 6, safeOnly = true }: { concurrency?: number; safeOnly?: boolean } = {},
): Promise<Anime[]> {
  const unique = Array.from(new Set(ids));
  const results: (Anime | null)[] = new Array(unique.length).fill(null);
  let cursor = 0;
  async function worker() {
    while (cursor < unique.length) {
      const idx = cursor++;
      results[idx] = await getAnimeByMalId(unique[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, unique.length) }, worker));
  const list = results.filter((a): a is Anime => !!a);
  return safeOnly ? list.filter(isSafe) : list;
}

/* ---------------- search ---------------- */
export interface SearchResultItem {
  malId?: number;
  id?: number;
  title: string;
  image?: string;
  poster?: string;
  type?: string;
  episodes?: number;
  score?: number;
  genres?: string[];
}

export async function searchAnime(q: string): Promise<Anime[]> {
  if (!q.trim()) return [];
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/search?q=${encodeURIComponent(q)}&limit=24`);
    const items: SearchResultItem[] = raw?.data || raw?.results || [];
    const ids = items.map((i) => i.malId ?? i.id).filter((x): x is number => !!x);
    return getAnimeBatch(ids, { concurrency: 8, safeOnly: true });
  } catch {
    return [];
  }
}

/* ---------------- season / trending ---------------- */
export async function getCurrentSeason(): Promise<Anime[]> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/anilist/season`);
    const media: any[] = raw?.media || [];
    const mapped: Anime[] = media
      .filter((m) => m.idMal)
      .map((m) => ({
        malId: m.idMal,
        anilistId: m.id,
        title: m.title?.english || m.title?.romaji || "Untitled",
        titleEnglish: m.title?.english,
        synopsis: m.description?.replace(/<[^>]+>/g, ""),
        poster: m.coverImage?.extraLarge || m.coverImage?.large || null,
        cover: m.coverImage?.extraLarge || m.coverImage?.large || null,
        banner: m.bannerImage || null,
        genres: m.genres || [],
        score: m.averageScore ?? null,
        episodes: m.episodes ?? null,
        year: null,
        status: m.status ?? null,
        type: m.format ?? null,
      }));
    const safe = mapped.filter(isSafe);
    safe.forEach(primeAnimeCache);
    return safe;
  } catch {
    return [];
  }
}

export async function getTopBanners(limit = 20): Promise<Record<string, string>> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/anilist/top-banners?limit=${limit}`);
    return raw?.data || {};
  } catch {
    return {};
  }
}

/* ---------------- detail extras ---------------- */
export async function getRecommendationsFor(malId: number): Promise<RecommendationEntry[]> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/anime/${malId}/recommendations`);
    return raw?.data || [];
  } catch {
    return [];
  }
}

export async function getVideosFor(malId: number): Promise<{ trailers: VideoEntry[]; musicVideos: VideoEntry[] }> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/anime/${malId}/videos`);
    return { trailers: raw?.trailers || [], musicVideos: raw?.musicVideos || [] };
  } catch {
    return { trailers: [], musicVideos: [] };
  }
}

export async function getStreamingPlatforms(malId: number): Promise<StreamingPlatform[]> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/anime/${malId}/streaming`);
    return raw?.data || [];
  } catch {
    return [];
  }
}

export async function getCharactersFor(malId: number): Promise<CharacterEntry[]> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/anime/${malId}/characters`);
    const list = raw?.data || raw?.characters || [];
    return list.map((c: any) => ({
      malId: c.malId ?? c.id,
      name: c.name,
      image: c.image,
      role: c.role,
      voiceActor: c.voiceActors?.[0]?.name || c.voiceActor,
      voiceActorImage: c.voiceActors?.[0]?.image,
    }));
  } catch {
    return [];
  }
}

export async function getEpisodeTitles(malId: number, page = 1): Promise<EpisodeMeta[]> {
  try {
    const raw = await getJSON<any>(`${API_BASE}/mal/anime/${malId}/episodes?page=${page}`);
    const list = raw?.data || raw?.episodes || [];
    return list.map((e: any) => ({
      num: e.num ?? e.number ?? e.mal_id,
      title: e.title,
      aired: e.aired,
      filler: e.filler,
      recap: e.recap,
    }));
  } catch {
    return [];
  }
}

/* ---------------- playback ---------------- */

export async function resolveWatch(opts: {
  malId: number;
  ep: number;
  type: "sub" | "dub";
  source?: "anikoto" | "desidub";
  server?: string;
  strict?: boolean;
}): Promise<WatchResult | null> {
  const { malId, ep, type, source = "anikoto", server, strict } = opts;

  const idPart = `mal-${malId}`;
  const query = new URLSearchParams();

  if (server) query.set("server", server);
  if (strict) query.set("strict", "1");

  const qs = query.toString();
  const url = `${API_BASE}/watch/${source}/${idPart}/${ep}/${type}${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url);
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      console.warn("[watch] failed", res.status, url, body);
      return null;
    }

    if (body?.error) {
      console.warn("[watch] api error", url, body);
      return null;
    }

    return body as WatchResult;
  } catch (e) {
    console.warn("[watch] network error", url, e);
    return null;
  }
}

/**
 * Tries to find a playable, ad-free (hls/mp4) stream. Falls back through
 * alternate servers and finally the alternate source before giving up and
 * returning whatever the API had (which may require an embed).
 */
export async function findBestStream(opts: {
  malId: number;
  ep: number;
  type: "sub" | "dub";
}): Promise<WatchResult | null> {
  const sources: Array<"anikoto" | "desidub"> = ["anikoto", "desidub"];
  let lastResult: WatchResult | null = null;

  for (const source of sources) {
    const first = await resolveWatch({ ...opts, source });
    if (!first) continue;

    lastResult = first;

    if (first.playbackMode === "hls" || first.playbackMode === "mp4") {
      return first;
    }

    const others = (first.availableServers || []).filter((s) => s !== first.server).slice(0, 4);

    for (const server of others) {
      const attempt = await resolveWatch({ ...opts, source, server, strict: true });

      if (attempt && (attempt.playbackMode === "hls" || attempt.playbackMode === "mp4")) {
        return attempt;
      }

      if (attempt) lastResult = attempt;
    }
  }

  return lastResult;
}

export function titleOf(a: Anime): string {
  return a.titleEnglish || a.title;
}

export function cleanDesc(desc?: string | null): string {
  if (!desc) return "";
  return desc
    .replace(/<[^>]+>/g, " ")
    .replace(/\(Source:.*?\)/gis, "")
    .replace(/\s+/g, " ")
    .trim();
}
