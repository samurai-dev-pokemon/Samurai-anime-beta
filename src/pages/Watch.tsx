import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Comments from "../components/Comments";
import { cn } from "../utils/cn";
import { href } from "../utils/router";
import { findBestStream, getAnimeByMalId, resolveWatch, titleOf } from "../lib/api";
import {
  markEpisodeWatched,
  removeFromWatchlist,
  removeProgress,
  saveProgress,
  useProgress,
  useProgressLoaded,
  useWatchedEpisodes,
} from "../lib/store";
import { useAsync } from "../lib/useAsync";
import { Container, ErrorNote, Icon, Skeleton } from "../components/ui";
import VideoPlayer from "../components/VideoPlayer";

/** Megaplay's direct MAL-id endpoint — no dependency on AniList mapping,
 *  works for any title since malId is always available (it's the route
 *  param itself). Per their docs, embeds only resolve when loaded inside
 *  an iframe on a real deployed domain — a blank player on localhost is
 *  expected, not a bug. */
function megaplayEmbedUrl(malId: number, ep: number, audio: "sub" | "dub"): string {
  return `https://megaplay.buzz/stream/mal/${malId}/${ep}/${audio}`;
}

export default function Watch() {
  const { malId = "" } = useParams();
  const id = Number(malId);
  const [params, setParams] = useSearchParams();
  const ep = Math.max(1, Number(params.get("ep")) || 1);
  const audio = (params.get("audio") === "dub" ? "dub" : "sub") as "sub" | "dub";
  const [server, setServer] = useState<string | undefined>(undefined);
  const [useEmbed, setUseEmbed] = useState(false);
  const lastSaved = useRef(0);

  const { data: anime, loading: animeLoading } = useAsync(() => getAnimeByMalId(id), [id]);

  const { data: stream, loading: streamLoading, error } = useAsync(async () => {
    setServer(undefined);
    return findBestStream({ malId: id, ep, type: audio });
  }, [id, ep, audio]);

  async function useServer(name: string) {
    setServer(name);
    const result = await resolveWatch({ malId: id, ep, type: audio, server: name, strict: true });
    return result;
  }
  const [manualStream, setManualStream] = useState<typeof stream>(null);
  useEffect(() => setManualStream(null), [id, ep, audio]);
  // Reset back to the default ad-free player whenever the episode changes,
  // so the embed toggle never silently carries over to a new episode.
  useEffect(() => setUseEmbed(false), [id, ep]);

  const activeStream = manualStream || stream || null;

  // Reactive, cloud-backed continue-watching progress. `progressLoaded`
  // flips true once the initial Firestore fetch (or a safety timeout)
  // completes, so playback never starts at 0:00 just because the cloud
  // data hasn't arrived yet on a fresh page load.
  const progress = useProgress();
  const progressLoaded = useProgressLoaded();
  const initial = progress.find((p) => p.animeId === id && p.episode === ep);

  const watchedEpisodes = useWatchedEpisodes(id);

  const onProgress = useCallback(
    (time: number, duration: number) => {
      if (!anime || !duration) return;
      const now = Date.now();
      if (now - lastSaved.current < 4000) return;
      lastSaved.current = now;
      saveProgress({
        animeId: id,
        title: titleOf(anime),
        cover: anime.poster || anime.cover || "",
        episode: ep,
        audio,
        provider: useEmbed ? "megaplay" : activeStream?.server || "anivault",
        time,
        duration,
        updatedAt: now,
      });
    },
    [anime, id, ep, audio, activeStream, useEmbed],
  );

  function goEp(n: number) {
    if (n < 1) return;
    if (anime?.episodes && n > anime.episodes) return;
    setParams({ ep: String(n), audio });
  }

  // Fires when an episode finishes — from either the native <video> element
  // (AniVault player) or the Megaplay embed's "complete" postMessage event
  // below, so both playback modes share identical behavior. Always marks
  // the episode as watched (drives the red tint on episode buttons). If
  // this was the final episode, the show is "finished" — pull it out of
  // the user's list and drop its continue-watching entry. Otherwise,
  // auto-advance straight into the next episode.
  const onEnded = useCallback(async () => {
    if (!anime) return;
    await markEpisodeWatched(id, ep);
    const isLastEpisode = !!anime.episodes && ep >= anime.episodes;
    if (isLastEpisode) {
      await removeFromWatchlist(id);
      await removeProgress(id);
    } else {
      goEp(ep + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime, id, ep]);

  // Megaplay embed → parent page communication via postMessage. Their
  // docs specify a "complete" event (episode ended) and a "watching-log"
  // event carrying playback position — wired into the exact same
  // onEnded/onProgress handlers the native player uses, so continue-
  // watching, the watched-episode tint, and auto-advance all work
  // identically regardless of which player is active. Field names for
  // the log event aren't fully pinned down in the docs, so a few common
  // aliases are checked defensively.
  useEffect(() => {
    if (!useEmbed) return;
    function onMessage(event: MessageEvent) {
      let data: any = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;

      if (data.type === "complete") {
        onEnded();
        return;
      }

      if (data.type === "watching-log" || data.channel === "megacloud") {
        const current = data.currentTime ?? data.time ?? data.position;
        const dur = data.duration ?? data.total;
        if (typeof current === "number" && typeof dur === "number" && dur > 0) {
          onProgress(current, dur);
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [useEmbed, onEnded, onProgress]);

  const totalEps = anime?.episodes || ep;
  const episodeList = Array.from({ length: Math.min(totalEps, 2000) }, (_, i) => i + 1);
  const playerLoading = streamLoading || !progressLoaded;

  const embedUrl = megaplayEmbedUrl(id, ep, audio);

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Container className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <Icon.Chevron className="h-3.5 w-3.5" />
          {anime && (
            <Link to={href.anime(anime.malId)} className="hover:text-white">
              {titleOf(anime)}
            </Link>
          )}
          <Icon.Chevron className="h-3.5 w-3.5" />
          <span className="text-zinc-200">Episode {ep}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Player mode toggle — AniVault (default, ad-free) vs Megaplay
                embed (opt-in, third-party, may include ads). */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
                <button
                  onClick={() => setUseEmbed(false)}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition", !useEmbed ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white")}
                >
                  <Icon.Shield className="h-3.5 w-3.5" /> AniVault Player
                </button>
                <button
                  onClick={() => setUseEmbed(true)}
                  className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition", useEmbed ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white")}
                >
                  <Icon.Globe className="h-3.5 w-3.5" /> Megaplay (embed)
                </button>
              </div>
              {useEmbed && (
                <span className="text-[11px] text-amber-400">Third-party embed — may include ads. Progress still saves to your account.</span>
              )}
            </div>

            {useEmbed ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
                <iframe
                  key={`megaplay-${id}-${ep}-${audio}`}
                  src={embedUrl}
                  allowFullScreen
                  className="h-full w-full"
                  title="Megaplay embed"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1 text-[11px] text-amber-300 backdrop-blur">
                  Embedded server — some ads may appear
                </div>
              </div>
            ) : playerLoading ? (
              <Skeleton className="aspect-video w-full" />
            ) : error ? (
              <ErrorNote msg={error} />
            ) : (
              <>
                {activeStream?.partial && audio === "dub" && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
                    <Icon.Info className="h-4 w-4 shrink-0" />
                    Dub isn't available for this episode yet — playing Sub instead.
                  </div>
                )}
                <VideoPlayer
                  key={`${id}-${ep}-${audio}-${server}`}
                  stream={activeStream}
                  startAt={initial?.time || 0}
                  title={anime ? `${titleOf(anime)} · Ep ${ep}` : undefined}
                  onProgress={onProgress}
                  onEnded={onEnded}
                  onNext={() => goEp(ep + 1)}
                  hasNext={!!anime?.episodes && ep < anime.episodes}
                />
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{anime ? titleOf(anime) : <span className="inline-block h-6 w-48 animate-pulse rounded bg-zinc-800" />}</h1>
                <p className="text-sm text-zinc-500">Episode {ep} of {anime?.episodes || "—"}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
                  {(["sub", "dub"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setParams({ ep: String(ep), audio: a })}
                      className={cn("rounded-full px-3 py-1.5 uppercase transition", audio === a ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white")}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <button onClick={() => goEp(ep - 1)} disabled={ep <= 1} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-30">
                  <Icon.ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => goEp(ep + 1)}
                  disabled={!!anime?.episodes && ep >= anime.episodes}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                  <Icon.Chevron className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!useEmbed && activeStream?.availableServers && activeStream.availableServers.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="text-xs font-medium text-zinc-500">Server:</span>
                {activeStream.availableServers.map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      const r = await useServer(s);
                      if (r) setManualStream(r);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      (server || activeStream.server) === s ? "border-red-500 bg-red-600/20 text-red-300" : "border-white/10 bg-white/5 text-zinc-400 hover:text-white",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {anime && (
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-500">{anime.synopsis?.slice(0, 320)}</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Episodes</p>
            <div className="grid max-h-[520px] grid-cols-5 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-6 lg:grid-cols-5">
              {animeLoading
                ? Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)
                : episodeList.map((n) => {
                    const isActive = n === ep;
                    const isWatched = watchedEpisodes.includes(n);
                    return (
                      <button
                        key={n}
                        onClick={() => goEp(n)}
                        className={cn(
                          "grid aspect-square place-items-center rounded-lg text-sm font-semibold transition",
                          isActive
                            ? "bg-red-600 text-white"
                            : isWatched
                              ? "bg-red-950/40 text-red-400 ring-1 ring-red-900/50 hover:bg-red-950/60"
                              : "bg-white/5 text-zinc-300 hover:bg-white/10",
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                  </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <Comments animeId={id} episode={ep} />
        </div>
      </Container>
    </div>
  );
}