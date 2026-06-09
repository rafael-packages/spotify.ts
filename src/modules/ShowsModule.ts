import { BaseModule } from './BaseModule';
import type { SpotifyShow, SpotifyEpisode, SpotifyPaging } from '../types';

/**
 * ShowsModule
 * Access podcast show catalogs.
 */
export class ShowsModule extends BaseModule {
  /**
   * Fetch a show by ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyShow> {
    return this.client.request<SpotifyShow>(`/shows/${id}`, { market });
  }

  /**
   * Fetch multiple shows by IDs.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ shows: SpotifyShow[] }> {
    return this.client.request<{ shows: SpotifyShow[] }>(`/shows`, { ids: ids.join(','), market });
  }

  /**
   * Fetch episodes of a show.
   */
  public async getEpisodes(id: string, market: string = 'US', limit: number = 20): Promise<SpotifyPaging<SpotifyEpisode>> {
    return this.client.request<SpotifyPaging<SpotifyEpisode>>(`/shows/${id}/episodes`, { market, limit });
  }
}
