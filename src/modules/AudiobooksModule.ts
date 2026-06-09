import { BaseModule } from './BaseModule';
import type { SpotifyAudiobook, SpotifyChapter, SpotifyPaging } from '../types';

/**
 * AudiobooksModule
 * Access Spotify audiobook catalogs.
 */
export class AudiobooksModule extends BaseModule {
  /**
   * Fetch an audiobook's details by ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyAudiobook> {
    return this.client.request<SpotifyAudiobook>(`/audiobooks/${id}`, { market });
  }

  /**
   * Fetch multiple audiobooks at once.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ audiobooks: SpotifyAudiobook[] }> {
    return this.client.request<{ audiobooks: SpotifyAudiobook[] }>(`/audiobooks`, { ids: ids.join(','), market });
  }

  /**
   * Fetch audiobook chapters by ID.
   */
  public async getChapters(id: string, market: string = 'US', limit: number = 20): Promise<SpotifyPaging<SpotifyChapter>> {
    return this.client.request<SpotifyPaging<SpotifyChapter>>(`/audiobooks/${id}/chapters`, { market, limit });
  }
}
