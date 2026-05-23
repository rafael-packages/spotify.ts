import { BaseModule } from './BaseModule';
import type { SpotifyCategory, SpotifyPaging } from '../types';

/**
 * CategoriesModule
 * Acesso às categorias do Spotify (ex: Party, Workout, Focus).
 */
export class CategoriesModule extends BaseModule {
  /**
   * Pega uma única categoria.
   */
  public async get(id: string, locale?: string): Promise<SpotifyCategory> {
    return this.client.request<SpotifyCategory>(`/browse/categories/${id}`, { locale });
  }

  /**
   * Pega a lista de categorias disponíveis no Spotify.
   */
  public async getMultiple(locale?: string, limit: number = 20): Promise<{ categories: SpotifyPaging<SpotifyCategory> }> {
    return this.client.request<{ categories: SpotifyPaging<SpotifyCategory> }>(`/browse/categories`, { locale, limit });
  }
}
