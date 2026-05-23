import { BaseModule } from './BaseModule';
import type { SpotifyChapter } from '../types';

/**
 * ChaptersModule
 * Acesso a capítulos específicos de audiobooks.
 */
export class ChaptersModule extends BaseModule {
  /**
   * Pega um capítulo pelo ID.
   */
  public async get(id: string, market: string = 'US'): Promise<SpotifyChapter> {
    return this.client.request<SpotifyChapter>(`/chapters/${id}`, { market });
  }

  /**
   * Pega múltiplos capítulos.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ chapters: SpotifyChapter[] }> {
    return this.client.request<{ chapters: SpotifyChapter[] }>(`/chapters`, { ids: ids.join(','), market });
  }
}
