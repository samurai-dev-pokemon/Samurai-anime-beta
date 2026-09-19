import { useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { uploadAvatar, MAX_AVATAR_BYTES } from "../lib/uploadAvatar";
import { setUser, useUser } from "../lib/store";
import { Container, Icon } from "../components/ui";

export default function Profile() {
  const user = useUser();
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.photoURL || null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <Container className="pt-32 pb-20">
        <p className="text-sm text-zinc-400">You need to be signed in to view this page.</p>
      </Container>
    );
  }

  function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setSaved(false);

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

  async function save() {
    if (!auth.currentUser) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      let photoURL = user!.photoURL || null;
      if (avatarFile) {
        photoURL = await uploadAvatar(avatarFile);
      }

      await updateProfile(auth.currentUser, {
        displayName: name.trim() || user!.name,
        photoURL: photoURL || undefined,
      });

      setUser({ ...user!, name: name.trim() || user!.name, photoURL });
      setAvatarFile(null);
      setSaved(true);
    } catch (err) {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = !!avatarFile || name.trim() !== user.name;

  return (
    <Container className="max-w-xl pt-28 pb-20">
      <h1 className="mb-1 text-2xl font-black tracking-tight text-white">Profile settings</h1>
      <p className="mb-8 text-sm text-zinc-500">Update your display name and profile picture.</p>

      <div className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-zinc-500 transition hover:border-red-500/50"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <Icon.User className="h-10 w-10" />
            )}
            <span className="absolute inset-0 grid place-items-center bg-black/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
              Change photo
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
          {avatarError && <p className="text-[11px] text-red-400">{avatarError}</p>}
          <p className="text-[11px] text-zinc-600">JPG/PNG up to 5MB</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Display name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/60 focus:bg-white/10"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-zinc-500 outline-none"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-xs text-red-300">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || !hasChanges}
            className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Icon.Loader className="h-4 w-4 animate-spin" /> : null}
            Save changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <Icon.Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </div>
    </Container>
  );
}