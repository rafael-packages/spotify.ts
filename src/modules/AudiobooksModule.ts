import { BaseModule } from './BaseModule';
import type { SpotifyAudiobook, SpotifyChapter, SpotifyPaging } from '../types';

/**
 * AudiobooksModule
 * Acesso ao catálogo de audiobooks do Spotify.
 */
export class AudiobooksModule extends BaseModule {
  /**
   * Pega os detalhes de um audiobook.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyAudiobook> {
    return this.client.request<SpotifyAudiobook>(`/audiobooks/${id}`, { market });
  }

  /**
   * Pega vários audiobooks de uma vez.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ audiobooks: SpotifyAudiobook[] }> {
    return this.client.request<{ audiobooks: SpotifyAudiobook[] }>(`/audiobooks`, { ids: ids.join(','), market });
  }

  /**
   * Pega os capítulos de um audiobook.
   */
  public async getChapters(id: string, market: string = 'US', limit: number = 20): Promise<SpotifyPaging<SpotifyChapter>> {
    return this.client.request<SpotifyPaging<SpotifyChapter>>(`/audiobooks/${id}/chapters`, { market, limit });
  }
}
