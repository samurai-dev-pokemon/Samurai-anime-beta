import { useParams } from "react-router-dom";
import { getAnimeBatch, getCurrentSeason } from "../lib/api";
import { ALL_CURATED_IDS } from "../lib/curated";
import { useAsync } from "../lib/useAsync";
import { AnimeCard, CardSkeletons, Container, ErrorNote } from "../components/ui";

export default function Genre() {
  const { name = "" } = useParams();

  const { data, loading, error } = useAsync(async () => {
    const [pool, season] = await Promise.all([getAnimeBatch(ALL_CURATED_IDS), getCurrentSeason()]);
    const merged = [...pool, ...season];
    const seen = new Set<number>();
    const unique = merged.filter((a) => (seen.has(a.malId) ? false : (seen.add(a.malId), true)));
    if (name.toLowerCase() === "trending") return unique.sort((a, b) => (b.score || 0) - (a.score || 0));
    return unique.filter((a) => a.genres.some((g) => g.toLowerCase() === name.toLowerCase()));
  }, [name]);

  return (
    <div className="min-h-screen pb-20 pt-28">
      <Container className="space-y-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{name}</h1>
        {loading ? (
          <CardSkeletons n={18} />
        ) : error ? (
          <ErrorNote msg={error} />
        ) : data?.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.map((a) => (
              <AnimeCard key={a.malId} anime={a} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No titles found for this genre yet.</p>
        )}
      </Container>
    </div>
  );
}
