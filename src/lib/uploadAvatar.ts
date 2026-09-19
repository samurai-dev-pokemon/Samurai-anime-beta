const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  if (!data?.success) throw new Error("Image upload failed");

  return data.data.url as string;
}