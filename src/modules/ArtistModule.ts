import { BaseModule } from './BaseModule';
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifyPaging } from '../types';

/**
 * ArtistModule
 * Handles artist catalog operations including top tracks, albums, and related artists.
 */
export class ArtistModule extends BaseModule {
  /**
   * Fetch core artist data by ID.
   */
  public async get(id: string): Promise<SpotifyArtist> {
    return this.client.request<SpotifyArtist>(`/artists/${id}`);
  }

  /**
   * Fetch multiple artists at once.
   */
  public async getMultiple(ids: string[]): Promise<{ artists: SpotifyArtist[] }> {
    return this.client.request<{ artists: SpotifyArtist[] }>(`/artists`, { ids: ids.join(',') });
  }

  /**
   * Fetch the top 10 tracks of the artist in the specified market.
   */
  public async getTopTracks(
    id: string,
    market: string = 'BR'
  ): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/artists/${id}/top-tracks`, { market });
  }

  /**
   * Fetch albums, singles, and EPs of the artist.
   */
  public async getAlbums(
    id: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<SpotifyAlbum>> {
    return this.client.request<SpotifyPaging<SpotifyAlbum>>(`/artists/${id}/albums`, {
      limit,
      offset,
    });
  }

  /**
   * Returns an async iterator to paginate over artist's albums.
   */
  public getAlbumsIterator(
    id: string,
    limit: number = 20
  ): AsyncGenerator<SpotifyAlbum, void, unknown> {
    return this.paginate<SpotifyAlbum>((offset) => this.getAlbums(id, limit, offset));
  }

  /**
   * Fetch related artists.
   */
  public async getRelated(id: string): Promise<{ artists: SpotifyArtist[] }> {
    return this.client.request<{ artists: SpotifyArtist[] }>(`/artists/${id}/related-artists`);
  }
}
