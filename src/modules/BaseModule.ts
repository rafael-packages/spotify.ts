import type { SpotifyClient } from '../SpotifyClient';

export abstract class BaseModule {
  protected client: SpotifyClient;

  constructor(client: SpotifyClient) {
    this.client = client;
  }
}
