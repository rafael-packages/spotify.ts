export interface SpotifyOptions {
  clientId: string;
  clientSecret: string;
  timeout?: number;
  maxRequestsPerSecond?: number;
}

export interface RequestInterceptor {
  (url: string, options: RequestInit): Promise<[string, RequestInit]>;
}

export interface ResponseInterceptor {
  (response: unknown): Promise<unknown>;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  href: string;
  type: 'artist';
  images?: SpotifyImage[];
  followers?: SpotifyFollowers;
  genres?: string[];
  popularity?: number;
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
  type: 'album';
  uri: string;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  is_local: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  collaborative: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  owner: SpotifyUser;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: 'playlist';
  uri: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  external_urls: SpotifyExternalUrls;
  followers?: SpotifyFollowers;
  href: string;
  images?: SpotifyImage[];
  type: 'user';
  uri: string;
}

export interface SpotifyPaging<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

export interface SpotifySearchResponse {
  tracks?: SpotifyPaging<SpotifyTrack>;
  artists?: SpotifyPaging<SpotifyArtist>;
  albums?: SpotifyPaging<SpotifyAlbum>;
  playlists?: SpotifyPaging<SpotifyPlaylist>;
  shows?: SpotifyPaging<SpotifyShow>;
  episodes?: SpotifyPaging<SpotifyEpisode>;
  audiobooks?: SpotifyPaging<SpotifyAudiobook>;
}

export interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  publisher: string;
  type: 'show';
  uri: string;
  total_episodes: number;
}

export interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  languages: string[];
  release_date: string;
  release_date_precision: string;
  type: 'episode';
  uri: string;
}

export interface SpotifyAudiobook {
  id: string;
  name: string;
  authors: { name: string }[];
  narrators: { name: string }[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  languages: string[];
  publisher: string;
  type: 'audiobook';
  uri: string;
  total_chapters: number;
}

export interface SpotifyChapter {
  id: string;
  name: string;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  images: SpotifyImage[];
  is_playable: boolean;
  languages: string[];
  release_date: string;
  release_date_precision: string;
  type: 'episode'; // Spotify treats chapters mostly like episodes
  uri: string;
}

export interface SpotifyCategory {
  id: string;
  name: string;
  href: string;
  icons: SpotifyImage[];
}

export interface SpotifyAudioFeatures {
  id: string;
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: 'audio_features';
  uri: string;
  valence: number;
}
