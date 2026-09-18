import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Icon } from "./ui";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/60">
      <div className="mx-auto max-w-[1700px] px-4 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-3">
            <Logo />
            <p className="text-sm leading-relaxed text-zinc-500">
              Samurai Anime is a fan-made streaming concept for browsing and watching anime with a clean,
              ad-free-first player. Metadata via MyAnimeList / AniList, playback via the AniVault scraper.
            </p>
            <div className="flex gap-3 pt-1 text-zinc-500">
              <Icon.Shield className="h-4 w-4" />
              <p className="text-xs">All titles are filtered to keep the browsing experience safe-for-work.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Explore</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/search" className="hover:text-white">Search</Link></li>
                <li><Link to="/my-list" className="hover:text-white">My List</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Genres</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link to="/genre/Action" className="hover:text-white">Action</Link></li>
                <li><Link to="/genre/Romance" className="hover:text-white">Romance</Link></li>
                <li><Link to="/genre/Fantasy" className="hover:text-white">Fantasy</Link></li>
                <li><Link to="/genre/Comedy" className="hover:text-white">Comedy</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Legal</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="cursor-default">Terms of Use</li>
                <li className="cursor-default">Privacy</li>
                <li className="cursor-default">Content Guidelines</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-white/5 pt-6 text-xs text-zinc-600">
          © {new Date().getFullYear()} Samurai Anime. Demo project — not affiliated with any streaming service. All logos & names are fictional.
        </p>
      </div>
    </footer>
  );
}
