import { BaseModule } from './BaseModule';
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifyPaging } from '../types';

export class ArtistModule extends BaseModule {
  public async get(id: string): Promise<SpotifyArtist> {
    return this.client.request<SpotifyArtist>(`/artists/${id}`);
  }

  public async getTopTracks(id: string, market: string = 'BR'): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/artists/${id}/top-tracks`, { market });
  }

  public async getAlbums(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyAlbum>> {
    return this.client.request<SpotifyPaging<SpotifyAlbum>>(`/artists/${id}/albums`, { limit });
  }

  public async getRelated(id: string): Promise<{ artists: SpotifyArtist[] }> {
    return this.client.request<{ artists: SpotifyArtist[] }>(`/artists/${id}/related-artists`);
  }
}
