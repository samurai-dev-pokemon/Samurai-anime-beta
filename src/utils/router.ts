// Central place for building internal links so route shapes only live in one file.
export const href = {
  home: () => "/",
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : "/search"),
  anime: (malId: number) => `/anime/${malId}`,
  watch: (malId: number, ep: number, audio: "sub" | "dub" = "sub") =>
    `/watch/${malId}?ep=${ep}&audio=${audio}`,
  genre: (genre: string) => `/genre/${encodeURIComponent(genre)}`,
  myList: () => "/my-list",
  profile: () => "/profile",
};
