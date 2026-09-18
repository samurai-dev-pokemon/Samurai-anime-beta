import { useState } from "react";
import { cn } from "../utils/cn";
import { setUser } from "../lib/store";
import { Icon } from "./ui";

export default function AuthModal({ mode, onClose }: { mode: "signin" | "signup"; onClose: () => void }) {
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (tab === "signup" && !name)) return;
    setLoading(true);
    window.setTimeout(() => {
      setUser({ name: tab === "signup" ? name : email.split("@")[0], email });
      setLoading(false);
      setDone(true);
      window.setTimeout(onClose, 900);
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-red-900/30 to-transparent" />
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white">
          <Icon.X className="h-4 w-4" />
        </button>

        <div className="relative space-y-6 p-8">
          <div className="space-y-1 text-center">
            <p className="text-2xl font-black uppercase tracking-tight text-white">
              Samurai<span className="text-red-600">Anime</span>
            </p>
            <p className="text-xs text-zinc-500">Demo authentication — no real account is created.</p>
          </div>

          <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-sm font-semibold">
            <button
              className={cn("flex-1 rounded-full py-2 transition", tab === "signin" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white")}
              onClick={() => setTab("signin")}
            >
              Sign In
            </button>
            <button
              className={cn("flex-1 rounded-full py-2 transition", tab === "signup" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white")}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-green-600/20 text-green-400">
                <Icon.Check className="h-6 w-6" />
              </span>
              <p className="text-sm text-zinc-300">
                {tab === "signup" ? "Account created" : "Welcome back"} — you're signed in for this demo session.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
              {tab === "signup" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Display name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kenshin"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60 focus:bg-white/10"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60 focus:bg-white/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {loading ? <Icon.Loader className="h-4 w-4 animate-spin" /> : null}
                {tab === "signin" ? "Sign In" : "Create Account"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-zinc-600">
                This is a front-end prototype only. No data leaves your browser and no real authentication occurs.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
