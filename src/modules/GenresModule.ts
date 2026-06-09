import { BaseModule } from './BaseModule';

/**
 * GenresModule
 * List available genres (used as seeds for recommendations).
 */
export class GenresModule extends BaseModule {
  /**
   * Fetch musical genres available on Spotify.
   */
  public async getAvailableSeeds(): Promise<{ genres: string[] }> {
    return this.client.request<{ genres: string[] }>(`/recommendations/available-genre-seeds`);
  }
}
