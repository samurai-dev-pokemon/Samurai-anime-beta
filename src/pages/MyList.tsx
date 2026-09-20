import { useState } from "react";
import { Link } from "react-router-dom";
import { href } from "../utils/router";
import { useUser, useWatchlist } from "../lib/store";
import { Container, Icon } from "../components/ui";
import AuthModal from "../components/AuthModal";

export default function MyList() {
  const user = useUser();
  const list = useWatchlist();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen pb-20 pt-28">
      <Container className="space-y-6">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">My List</h1>

        {!user ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
            <Icon.User className="h-8 w-8 text-zinc-600" />
            <p className="text-zinc-400">Sign in to build and sync your watchlist across devices.</p>
            <button
              onClick={() => setShowAuth(true)}
              className="mt-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Sign In / Sign Up
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
            <Icon.Plus className="h-8 w-8 text-zinc-600" />
            <p className="text-zinc-400">Your list is empty. Add anime from any details page.</p>
            <Link to="/" className="mt-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500">
              Browse anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {list.map((w) => (
              <Link key={w.animeId} to={href.anime(w.animeId)} className="group block">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/5 transition duration-300 group-hover:scale-[1.04] group-hover:ring-red-500/40">
                  {w.cover ? <img src={w.cover} alt={w.title} className="h-full w-full object-cover" /> : null}
                </div>
                <p className="mt-1.5 line-clamp-1 text-sm text-zinc-200">{w.title}</p>
              </Link>
            ))}
          </div>
        )}
      </Container>

      {showAuth && <AuthModal mode="signin" onClose={() => setShowAuth(false)} />}
    </div>
  );
}