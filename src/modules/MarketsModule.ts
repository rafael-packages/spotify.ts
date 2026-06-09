import { BaseModule } from './BaseModule';

/**
 * MarketsModule
 * Operating markets supported by Spotify.
 */
export class MarketsModule extends BaseModule {
  /**
   * Fetch all supported markets (countries).
   */
  public async getAvailable(): Promise<{ markets: string[] }> {
    return this.client.request<{ markets: string[] }>(`/markets`);
  }
}
