// Central place for building internal links so route shapes only live in one file.
// Prefixed with "#" because the app uses HashRouter — without this, plain
// <a href="..."> tags cause a full browser navigation to a path the
// dev/static server doesn't know about (404), instead of being handled
// client-side by React Router.
export const href = {
  home: () => "#/",
  search: (q?: string) => (q ? `#/search?q=${encodeURIComponent(q)}` : "#/search"),
  anime: (malId: number) => `#/anime/${malId}`,
  watch: (malId: number, ep: number, audio: "sub" | "dub" = "sub") =>
    `#/watch/${malId}?ep=${ep}&audio=${audio}`,
  genre: (genre: string) => `#/genre/${encodeURIComponent(genre)}`,
  myList: () => "#/my-list",
};
