import { BaseModule } from './BaseModule';
import type { SpotifyEpisode } from '../types';

/**
 * EpisodesModule
 * Access podcast episode details.
 */
export class EpisodesModule extends BaseModule {
  /**
   * Fetch a podcast episode by ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyEpisode> {
    return this.client.request<SpotifyEpisode>(`/episodes/${id}`, { market });
  }

  /**
   * Fetch multiple podcast episodes by IDs.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ episodes: SpotifyEpisode[] }> {
    return this.client.request<{ episodes: SpotifyEpisode[] }>(`/episodes`, { ids: ids.join(','), market });
  }
}
