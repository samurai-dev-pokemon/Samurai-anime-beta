import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchAnime } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { href } from "../utils/router";
import { AnimeCard, CardSkeletons, Container, ErrorNote, Icon } from "../components/ui";

const QUICK_GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural"];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [input, setInput] = useState(initial);
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    setInput(initial);
    setQuery(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const { data, loading, error } = useAsync(() => searchAnime(query), [query], query.trim().length > 0);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input.trim());
    setParams(input.trim() ? { q: input.trim() } : {});
  }

  return (
    <div className="min-h-screen pb-20 pt-28">
      <Container className="space-y-8">
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Search</h1>
          <form onSubmit={onSubmit} className="flex max-w-xl items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 focus-within:border-red-500/60">
            <Icon.Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for anime titles..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            />
            {input && (
              <button type="button" onClick={() => setInput("")} className="text-zinc-500 hover:text-white">
                <Icon.X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex flex-wrap gap-2">
            {QUICK_GENRES.map((g) => (
              <Link key={g} to={href.genre(g)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 transition hover:border-red-500/40 hover:text-white">
                {g}
              </Link>
            ))}
          </div>
        </div>

        {!query.trim() ? (
          <p className="text-sm text-zinc-500">Start typing to search thousands of titles.</p>
        ) : loading ? (
          <CardSkeletons n={12} />
        ) : error ? (
          <ErrorNote msg={error} />
        ) : data?.length ? (
          <>
            <p className="text-sm text-zinc-500">
              {data.length} result{data.length === 1 ? "" : "s"} for <span className="text-zinc-300">"{query}"</span>
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data.map((a) => (
                <AnimeCard key={a.malId} anime={a} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
            No safe-for-work results found for "{query}". Try a different title.
          </div>
        )}
      </Container>
    </div>
  );
}
