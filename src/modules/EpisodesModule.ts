import { BaseModule } from './BaseModule';
import type { SpotifyEpisode } from '../types';

/**
 * EpisodesModule
 * Acesso a episódios de podcasts.
 */
export class EpisodesModule extends BaseModule {
  /**
   * Pega um episódio pelo ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyEpisode> {
    return this.client.request<SpotifyEpisode>(`/episodes/${id}`, { market });
  }

  /**
   * Pega múltiplos episódios de uma vez.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ episodes: SpotifyEpisode[] }> {
    return this.client.request<{ episodes: SpotifyEpisode[] }>(`/episodes`, { ids: ids.join(','), market });
  }
}
