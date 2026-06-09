import { BaseModule } from './BaseModule';
import type { SpotifyAlbum, SpotifyTrack, SpotifyPaging } from '../types';

/**
 * AlbumModule
 * Acesso direto ao catálogo de álbuns.
 */
export class AlbumModule extends BaseModule {
  /**
   * Pega um álbum específico.
   */
  public async get(id: string): Promise<SpotifyAlbum> {
    return this.client.request<SpotifyAlbum>(`/albums/${id}`);
  }

  /**
   * Pega múltiplos álbuns numa pancada só.
   */
  public async getMultiple(
    ids: string[],
    market: string = 'US'
  ): Promise<{ albums: SpotifyAlbum[] }> {
    return this.client.request<{ albums: SpotifyAlbum[] }>(`/albums`, {
      ids: ids.join(','),
      market,
    });
  }

  /**
   * Traz as faixas do álbum.
   */
  public async getTracks(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyTrack>> {
    return this.client.request<SpotifyPaging<SpotifyTrack>>(`/albums/${id}/tracks`, { limit });
  }

  /**
   * Traz os novos lançamentos do momento no Spotify.
   */
  public async getNewReleases(
    country?: string,
    limit: number = 20
  ): Promise<{ albums: SpotifyPaging<SpotifyAlbum> }> {
    return this.client.request<{ albums: SpotifyPaging<SpotifyAlbum> }>(`/browse/new-releases`, {
      country,
      limit,
    });
  }
}
