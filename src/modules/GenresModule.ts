import { BaseModule } from './BaseModule';

/**
 * GenresModule
 * Lista os gêneros disponíveis (usados como seeds para recomendações).
 */
export class GenresModule extends BaseModule {
  /**
   * Retorna os gêneros musicais disponíveis na API do Spotify.
   */
  public async getAvailableSeeds(): Promise<{ genres: string[] }> {
    return this.client.request<{ genres: string[] }>(`/recommendations/available-genre-seeds`);
  }
}
