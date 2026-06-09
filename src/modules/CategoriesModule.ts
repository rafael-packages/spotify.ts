import { BaseModule } from './BaseModule';
import type { SpotifyCategory, SpotifyPaging } from '../types';

/**
 * CategoriesModule
 * Access Spotify browse categories (e.g., Party, Workout, Focus).
 */
export class CategoriesModule extends BaseModule {
  /**
   * Fetch a single category by ID.
   */
  public async get(id: string, locale?: string): Promise<SpotifyCategory> {
    return this.client.request<SpotifyCategory>(`/browse/categories/${id}`, { locale });
  }

  /**
   * Fetch lists of available Spotify browse categories.
   */
  public async getMultiple(locale?: string, limit: number = 20): Promise<{ categories: SpotifyPaging<SpotifyCategory> }> {
    return this.client.request<{ categories: SpotifyPaging<SpotifyCategory> }>(`/browse/categories`, { locale, limit });
  }
}
