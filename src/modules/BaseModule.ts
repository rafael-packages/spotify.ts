import type { SpotifyClient } from '../SpotifyClient';
import type { SpotifyPaging } from '../types';

export abstract class BaseModule {
  protected client: SpotifyClient;

  constructor(client: SpotifyClient) {
    this.client = client;
  }

  /**
   * Helper generator to paginate through Spotify responses.
   */
  protected async *paginate<T>(
    requestPage: (offset: number) => Promise<SpotifyPaging<T>>,
    maxPages?: number
  ): AsyncGenerator<T, void, unknown> {
    let offset = 0;
    let pageCount = 0;
    while (true) {
      const response = await requestPage(offset);
      const items = response.items;
      if (!items || items.length === 0) {
        break;
      }
      for (const item of items) {
        yield item;
      }
      offset += items.length;
      pageCount++;
      if (maxPages && pageCount >= maxPages) {
        break;
      }
      if (!response.next) {
        break;
      }
    }
  }
}
