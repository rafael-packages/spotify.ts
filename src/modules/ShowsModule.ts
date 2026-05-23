import { BaseModule } from './BaseModule';
import type { SpotifyShow, SpotifyEpisode, SpotifyPaging } from '../types';

/**
 * ShowsModule
 * Acesso a programas de podcast (shows) no Spotify.
 */
export class ShowsModule extends BaseModule {
  /**
   * Pega um programa pelo ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyShow> {
    return this.client.request<SpotifyShow>(`/shows/${id}`, { market });
  }

  /**
   * Pega múltiplos programas.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ shows: SpotifyShow[] }> {
    return this.client.request<{ shows: SpotifyShow[] }>(`/shows`, { ids: ids.join(','), market });
  }

  /**
   * Pega todos os episódios de um programa.
   */
  public async getEpisodes(id: string, market: string = 'US', limit: number = 20): Promise<SpotifyPaging<SpotifyEpisode>> {
    return this.client.request<SpotifyPaging<SpotifyEpisode>>(`/shows/${id}/episodes`, { market, limit });
  }
}
