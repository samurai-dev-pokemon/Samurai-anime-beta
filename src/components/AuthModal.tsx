import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { uploadAvatar, MAX_AVATAR_BYTES } from "../lib/uploadAvatar";
import { cn } from "../utils/cn";
import { setUser } from "../lib/store";
import { Icon } from "./ui";

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthModal({ mode, onClose }: { mode: "signin" | "signup"; onClose: () => void }) {
  const [tab, setTab] = useState<"signin" | "signup">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(`Image must be under ${Math.round(MAX_AVATAR_BYTES / (1024 * 1024))}MB.`);
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password || (tab === "signup" && !name)) return;

    setLoading(true);
    try {
      if (tab === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        let photoURL: string | null = null;
        if (avatarFile) {
          try {
            photoURL = await uploadAvatar(avatarFile);
          } catch {
            // Avatar upload failing shouldn't block account creation.
            photoURL = null;
          }
        }

        await updateProfile(cred.user, { displayName: name, photoURL: photoURL || undefined });

        setUser({ uid: cred.user.uid, name, email: cred.user.email || email, photoURL });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUser({
          uid: cred.user.uid,
          name: cred.user.displayName || cred.user.email?.split("@")[0] || "User",
          email: cred.user.email || email,
          photoURL: cred.user.photoURL,
        });
      }

      setDone(true);
      window.setTimeout(onClose, 900);
    } catch (err: any) {
      setError(firebaseErrorMessage(err?.code || ""));
    } finally {
      setLoading(false);
    }
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
            <p className="text-xs text-zinc-500">Sign in to save your progress and watchlist.</p>
          </div>

          <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-sm font-semibold">
            <button
              type="button"
              className={cn("flex-1 rounded-full py-2 transition", tab === "signin" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white")}
              onClick={() => {
                setTab("signin");
                setError(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={cn("flex-1 rounded-full py-2 transition", tab === "signup" ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white")}
              onClick={() => {
                setTab("signup");
                setError(null);
              }}
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
                {tab === "signup" ? "Account created" : "Welcome back"} — you're signed in.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
              {tab === "signup" && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-zinc-500 transition hover:border-red-500/50"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                    ) : (
                      <Icon.User className="h-8 w-8" />
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-black/50 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      {avatarPreview ? "Change" : "Upload"}
                    </span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
                  {avatarError && <p className="text-[11px] text-red-400">{avatarError}</p>}
                  <p className="text-[11px] text-zinc-600">Optional · JPG/PNG up to 5MB</p>
                </div>
              )}

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

              {error && (
                <p className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-xs text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {loading ? <Icon.Loader className="h-4 w-4 animate-spin" /> : null}
                {tab === "signin" ? "Sign In" : "Create Account"}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-zinc-600">
                By continuing you agree to our terms. Your info is only used to personalize your experience.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}