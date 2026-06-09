import { BaseModule } from './BaseModule';
import type { SpotifySearchResponse, SpotifyTrack, SpotifyAlbum, SpotifyArtist } from '../types';

/**
 * SearchModule
 * Search Spotify catalog for tracks, albums, artists, etc.
 */
export class SearchModule extends BaseModule {
  /**
   * Search Spotify items.
   */
  public async get(
    query: string,
    types: string[] = ['track', 'artist', 'album'],
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifySearchResponse> {
    return this.client.request<SpotifySearchResponse>(`/search`, { 
      q: query, 
      type: types.join(','),
      limit,
      offset
    });
  }

  /**
   * Returns an async iterator to paginate over track search results.
   */
  public tracksIterator(query: string, limit: number = 20): AsyncGenerator<SpotifyTrack, void, unknown> {
    return this.paginate<SpotifyTrack>(async (offset) => {
      const res = await this.get(query, ['track'], limit, offset);
      return res.tracks!;
    });
  }

  /**
   * Returns an async iterator to paginate over album search results.
   */
  public albumsIterator(query: string, limit: number = 20): AsyncGenerator<SpotifyAlbum, void, unknown> {
    return this.paginate<SpotifyAlbum>(async (offset) => {
      const res = await this.get(query, ['album'], limit, offset);
      return res.albums!;
    });
  }

  /**
   * Returns an async iterator to paginate over artist search results.
   */
  public artistsIterator(query: string, limit: number = 20): AsyncGenerator<SpotifyArtist, void, unknown> {
    return this.paginate<SpotifyArtist>(async (offset) => {
      const res = await this.get(query, ['artist'], limit, offset);
      return res.artists!;
    });
  }
}
