export interface Anime {
  malId: number;
  anilistId?: number;
  title: string;
  titleEnglish?: string | null;
  titleJapanese?: string | null;
  synopsis?: string | null;
  poster?: string | null;
  cover?: string | null;
  banner?: string | null;
  logo?: string | null;
  genres: string[];
  score?: number | null;
  episodes?: number | null;
  year?: number | null;
  status?: string | null;
  type?: string | null;
  studios?: string[];
  rating?: string | null;
  duration?: string | null;
  aired?: string | null;
}

export interface StreamingPlatform {
  name: string;
  url: string;
}

export interface VideoEntry {
  label: string;
  youtubeId: string;
  embedUrl: string;
  songTitle?: string;
  songArtist?: string;
}

export interface RecommendationEntry {
  animeId: number;
  title: string;
  image: string;
  votes: number;
}

export interface CharacterEntry {
  malId?: number;
  name: string;
  image?: string;
  role?: string;
  voiceActor?: string;
  voiceActorImage?: string;
}

export interface EpisodeMeta {
  num: number;
  title?: string;
  aired?: string;
  filler?: boolean;
  recap?: boolean;
}

export interface Subtitle {
  url: string;
  lang: string;
  default?: boolean;
}

export interface WatchResult {
  embedUrl?: string;
  m3u8?: string;
  hlsProxyUrl?: string;
  mp4?: string;
  playbackMode?: "hls" | "mp4" | "embed" | string;
  iframeOnly?: boolean;
  subtitles?: Subtitle[];
  server?: string;
  availableServers?: string[];
  intro?: { start: number; end: number } | null;
  outro?: { start: number; end: number } | null;
  note?: string | null;
}

export interface ProgressEntry {
  animeId: number;
  title: string;
  cover: string;
  episode: number;
  audio: "sub" | "dub";
  provider: string;
  time: number;
  duration: number;
  updatedAt: number;
}

export interface WatchlistEntry {
  animeId: number;
  title: string;
  cover: string;
  addedAt: number;
}

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
}