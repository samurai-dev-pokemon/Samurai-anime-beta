import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { cn } from "../utils/cn";
import { href } from "../utils/router";
import { findBestStream, getAnimeByMalId, resolveWatch, titleOf } from "../lib/api";
import { getProgress, saveProgress } from "../lib/store";
import { useAsync } from "../lib/useAsync";
import { Container, ErrorNote, Icon, Skeleton } from "../components/ui";
import VideoPlayer from "../components/VideoPlayer";

export default function Watch() {
  const { malId = "" } = useParams();
  const id = Number(malId);
  const [params, setParams] = useSearchParams();
  const ep = Math.max(1, Number(params.get("ep")) || 1);
  const audio = (params.get("audio") === "dub" ? "dub" : "sub") as "sub" | "dub";
  const [server, setServer] = useState<string | undefined>(undefined);
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

  const activeStream = manualStream || stream || null;
  const initial = getProgress().find((p) => p.animeId === id && p.episode === ep);

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
        provider: activeStream?.server || "anivault",
        time,
        duration,
        updatedAt: now,
      });
    },
    [anime, id, ep, audio, activeStream],
  );

  function goEp(n: number) {
    if (n < 1) return;
    if (anime?.episodes && n > anime.episodes) return;
    setParams({ ep: String(n), audio });
  }

  const totalEps = anime?.episodes || ep;
  const episodeList = Array.from({ length: Math.min(totalEps, 2000) }, (_, i) => i + 1);

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
            {streamLoading ? (
              <Skeleton className="aspect-video w-full" />
            ) : error ? (
              <ErrorNote msg={error} />
            ) : (
              <VideoPlayer
                key={`${id}-${ep}-${audio}-${server}`}
                stream={activeStream}
                startAt={initial?.time || 0}
                title={anime ? `${titleOf(anime)} · Ep ${ep}` : undefined}
                onProgress={onProgress}
                onNext={() => goEp(ep + 1)}
                hasNext={!!anime?.episodes && ep < anime.episodes}
              />
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

            {activeStream?.availableServers && activeStream.availableServers.length > 1 && (
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
                : episodeList.map((n) => (
                    <button
                      key={n}
                      onClick={() => goEp(n)}
                      className={cn(
                        "grid aspect-square place-items-center rounded-lg text-sm font-semibold transition",
                        n === ep ? "bg-red-600 text-white" : "bg-white/5 text-zinc-300 hover:bg-white/10",
                      )}
                    >
                      {n}
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
