import { BaseModule } from './BaseModule';
import type { SpotifySearchResponse } from '../types';

export class SearchModule extends BaseModule {
  public async get(query: string, types: string[] = ['track', 'artist', 'album'], limit: number = 20): Promise<SpotifySearchResponse> {
    return this.client.request<SpotifySearchResponse>(`/search`, { 
      q: query, 
      type: types.join(','),
      limit
    });
  }
}
