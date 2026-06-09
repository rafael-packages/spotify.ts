import { BaseModule } from './BaseModule';
import type { SpotifyChapter } from '../types';

/**
 * ChaptersModule
 * Access specific audiobook chapters.
 */
export class ChaptersModule extends BaseModule {
  /**
   * Fetch a chapter's details by ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyChapter> {
    return this.client.request<SpotifyChapter>(`/chapters/${id}`, { market });
  }

  /**
   * Fetch multiple audiobook chapters by IDs.
   */
  public async getMultiple(
    ids: string[],
    market: string = 'US'
  ): Promise<{ chapters: SpotifyChapter[] }> {
    return this.client.request<{ chapters: SpotifyChapter[] }>(`/chapters`, {
      ids: ids.join(','),
      market,
    });
  }
}
