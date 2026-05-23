import { BaseModule } from './BaseModule';

/**
 * MarketsModule
 * Mercados onde o Spotify opera.
 */
export class MarketsModule extends BaseModule {
  /**
   * Retorna todos os mercados (países) suportados.
   */
  public async getAvailable(): Promise<{ markets: string[] }> {
    return this.client.request<{ markets: string[] }>(`/markets`);
  }
}
