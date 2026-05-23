import { BaseModule } from './BaseModule';
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifyPaging } from '../types';

/**
 * ArtistModule
 * Focado no artista: top faixas, álbuns e relacionados.
 */
export class ArtistModule extends BaseModule {
  /**
   * Pega os dados principais do artista.
   */
  public async get(id: string): Promise<SpotifyArtist> {
    return this.client.request<SpotifyArtist>(`/artists/${id}`);
  }

  /**
   * Pega múltiplos artistas de uma vez.
   */
  public async getMultiple(ids: string[]): Promise<{ artists: SpotifyArtist[] }> {
    return this.client.request<{ artists: SpotifyArtist[] }>(`/artists`, { ids: ids.join(',') });
  }

  /**
   * As top 10 músicas mais famosas do artista no mercado informado.
   */
  public async getTopTracks(id: string, market: string = 'BR'): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/artists/${id}/top-tracks`, { market });
  }

  /**
   * Todos os álbuns, singles e EPs já lançados pelo artista.
   */
  public async getAlbums(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyAlbum>> {
    return this.client.request<SpotifyPaging<SpotifyAlbum>>(`/artists/${id}/albums`, { limit });
  }

  /**
   * Descubra artistas parecidos com este.
   */
  public async getRelated(id: string): Promise<{ artists: SpotifyArtist[] }> {
    return this.client.request<{ artists: SpotifyArtist[] }>(`/artists/${id}/related-artists`);
  }
}
