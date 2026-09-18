import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { href } from "../utils/router";
import {
  cleanDesc,
  getAnimeByMalId,
  getCharactersFor,
  getRecommendationsFor,
  getStreamingPlatforms,
  getVideosFor,
  titleOf,
} from "../lib/api";
import { getAnimeBatch } from "../lib/api";
import { isInWatchlist, toggleWatchlist } from "../lib/store";
import { useAsync } from "../lib/useAsync";
import { AnimeCard, Badge, CardRow, CardSkeletons, Container, ErrorNote, Icon, RowItem, Section, Skeleton } from "../components/ui";

export default function AnimeDetails() {
  const { malId = "" } = useParams();
  const id = Number(malId);
  const [tick, setTick] = useState(0);
  const [inList, setInList] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: anime, loading, error } = useAsync(() => getAnimeByMalId(id), [id, tick]);

  const extras = useAsync(async () => {
    const [chars, videos, platforms, recs] = await Promise.all([
      getCharactersFor(id),
      getVideosFor(id),
      getStreamingPlatforms(id),
      getRecommendationsFor(id),
    ]);
    const recAnime = await getAnimeBatch(recs.map((r) => r.animeId).slice(0, 12));
    return { chars, videos, platforms, recAnime };
  }, [id]);

  useMemo(() => {
    if (id) setInList(isInWatchlist(id));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="h-[50vh] w-full rounded-none" />
        <Container className="-mt-24 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </Container>
      </div>
    );
  }
  if (error || !anime) {
    return (
      <Container className="pt-32">
        <ErrorNote msg={error || "Anime not found"} retry={() => setTick((t) => t + 1)} />
      </Container>
    );
  }

  const trailer = extras.data?.videos.trailers?.[0];
  const episodeCount = anime.episodes || 12;
  const episodeNumbers = Array.from({ length: Math.min(episodeCount, 2000) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[56vh] min-h-[380px] w-full overflow-hidden">
        <img src={anime.banner || anime.cover || anime.poster || ""} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/20 to-transparent" />
      </div>

      <Container className="-mt-40 flex flex-col gap-8 lg:flex-row">
        <div className="mx-auto w-40 shrink-0 sm:w-56 lg:mx-0">
          <div className="overflow-hidden rounded-xl shadow-2xl shadow-black ring-1 ring-white/10">
            {anime.poster && <img src={anime.poster} alt={titleOf(anime)} className="w-full object-cover" />}
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {anime.score ? (
                <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-300">
                  <Icon.Star className="mr-1 h-3 w-3" /> {(anime.score / 10).toFixed(1)}
                </Badge>
              ) : null}
              {anime.year && <Badge>{anime.year}</Badge>}
              {anime.type && <Badge>{anime.type}</Badge>}
              {anime.episodes && <Badge>{anime.episodes} episodes</Badge>}
              {anime.status && <Badge>{anime.status}</Badge>}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{titleOf(anime)}</h1>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <Badge key={g} className="text-zinc-400">{g}</Badge>
              ))}
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">{cleanDesc(anime.synopsis) || "No synopsis available."}</p>
            {anime.studios && anime.studios.length > 0 && (
              <p className="text-xs text-zinc-500">Studio: {anime.studios.join(", ")}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href={href.watch(anime.malId, 1, "sub")} className="inline-flex h-11 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500">
              <Icon.Play className="h-4 w-4" /> Watch Episode 1
            </a>
            {trailer && (
              <button onClick={() => setShowTrailer(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-zinc-100 backdrop-blur transition hover:bg-white/10">
                <Icon.Film className="h-4 w-4" /> Trailer
              </button>
            )}
            <button
              onClick={() => {
                const added = toggleWatchlist({ animeId: anime.malId, title: titleOf(anime), cover: anime.poster || anime.cover || "" });
                setInList(added);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-zinc-100 backdrop-blur transition hover:bg-white/10"
            >
              {inList ? <Icon.Check className="h-4 w-4 text-green-400" /> : <Icon.Plus className="h-4 w-4" />}
              {inList ? "In My List" : "Add to List"}
            </button>
          </div>

          {extras.data?.platforms && extras.data.platforms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-500">
              <span>Also legally available on:</span>
              {extras.data.platforms.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-2.5 py-1 text-zinc-300 hover:border-red-500/50 hover:text-white">
                  {p.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-14 space-y-12">
        <Section title="Episodes">
          <div className="grid max-h-[420px] grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {episodeNumbers.map((n) => (
              <a
                key={n}
                href={href.watch(anime.malId, n, "sub")}
                className="grid aspect-square place-items-center rounded-lg bg-white/5 text-sm font-semibold text-zinc-300 transition hover:bg-red-600 hover:text-white"
              >
                {n}
              </a>
            ))}
          </div>
        </Section>

        {extras.loading ? (
          <CardSkeletons row n={8} />
        ) : (
          <>
            {extras.data?.chars && extras.data.chars.length > 0 && (
              <Section title="Characters & voice actors">
                <CardRow>
                  {extras.data.chars.slice(0, 16).map((c, idx) => (
                    <RowItem key={idx}>
                      <div className="overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/5">
                        <div className="aspect-[2/3] w-full">
                          {c.image ? <img src={c.image} alt={c.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-zinc-700"><Icon.User className="h-8 w-8" /></div>}
                        </div>
                      </div>
                      <p className="mt-1.5 line-clamp-1 text-xs font-medium text-zinc-200">{c.name}</p>
                      {c.voiceActor && <p className="line-clamp-1 text-[11px] text-zinc-500">{c.voiceActor}</p>}
                    </RowItem>
                  ))}
                </CardRow>
              </Section>
            )}

            {extras.data?.recAnime && extras.data.recAnime.length > 0 && (
              <Section title="More like this">
                <CardRow>
                  {extras.data.recAnime.map((a) => (
                    <RowItem key={a.malId}>
                      <AnimeCard anime={a} />
                    </RowItem>
                  ))}
                </CardRow>
              </Section>
            )}
          </>
        )}
      </Container>

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4" onClick={() => setShowTrailer(false)}>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <iframe src={trailer.embedUrl} title="Trailer" allow="autoplay; fullscreen" allowFullScreen className="h-full w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
