import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { href } from "../utils/router";
import { useUser, setUser } from "../lib/store";
import { Icon } from "./ui";
import Logo from "./Logo";
import AuthModal from "./AuthModal";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Trending", to: "/genre/Trending" },
  { label: "Action", to: "/genre/Action" },
  { label: "Romance", to: "/genre/Romance" },
  { label: "Fantasy", to: "/genre/Fantasy" },
  { label: "My List", to: "/my-list" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useUser();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(href.search(q.trim()));
    setSearchOpen(false);
  }

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", scrolled || mobileOpen ? "bg-zinc-950/95 shadow-lg shadow-black/40 backdrop-blur" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent")}>
        <div className="mx-auto flex h-16 w-full max-w-[1700px] items-center gap-4 px-4 sm:px-8 lg:px-12">
          <button className="grid h-9 w-9 place-items-center rounded-md text-zinc-300 lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            <Icon.Menu className="h-5 w-5" />
          </button>

          <Logo />

          <nav className="ml-4 hidden items-center gap-6 text-sm font-medium text-zinc-300 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <form onSubmit={submitSearch} className={cn("flex items-center overflow-hidden rounded-full border border-white/10 bg-black/50 transition-all", searchOpen ? "w-40 px-3 sm:w-64" : "w-9 justify-center")}>
              <button type="button" onClick={() => setSearchOpen((v) => !v)} className="grid h-9 w-9 shrink-0 place-items-center text-zinc-300 hover:text-white" aria-label="Search">
                <Icon.Search className="h-4 w-4" />
              </button>
              {searchOpen && (
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full bg-transparent py-2 text-sm text-white placeholder-zinc-500 outline-none"
                />
              )}
            </form>

            <button className="hidden h-9 w-9 place-items-center rounded-full text-zinc-300 hover:text-white sm:grid" aria-label="Notifications">
              <Icon.Bell className="h-4.5 w-4.5" />
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-2 text-sm text-zinc-200 transition hover:bg-white/10">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-red-600 text-xs font-bold uppercase text-white">{user.name.slice(0, 1)}</span>
                  <span className="hidden max-w-[90px] truncate sm:inline">{user.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-xl" onMouseLeave={() => setMenuOpen(false)}>
                    <Link to={href.myList()} className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white" onClick={() => setMenuOpen(false)}>
                      My List
                    </Link>
                    <button
                      className="block w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                      onClick={() => {
                        setUser(null);
                        setMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setAuthMode("signin")} className="hidden rounded-full px-4 py-1.5 text-sm font-semibold text-zinc-200 transition hover:text-white sm:block">
                  Sign In
                </button>
                <button onClick={() => setAuthMode("signup")} className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white shadow shadow-red-900/40 transition hover:bg-red-500">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 lg:hidden">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            {!user && (
              <button onClick={() => setAuthMode("signin")} className="rounded-lg px-3 py-2 text-left hover:bg-white/5 hover:text-white">
                Sign In
              </button>
            )}
          </nav>
        )}
      </header>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
    </>
  );
}
