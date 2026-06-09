import { BaseModule } from './BaseModule';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyPaging } from '../types';

/**
 * PlaylistModule
 * Access playlist metadata and tracks.
 */
export class PlaylistModule extends BaseModule {
  /**
   * Fetch playlist details by ID.
   */
  public async get(id: string): Promise<SpotifyPlaylist> {
    return this.client.request<SpotifyPlaylist>(`/playlists/${id}`);
  }

  /**
   * Fetch tracks from a playlist.
   */
  public async getTracks(
    id: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<{ track: SpotifyTrack }>> {
    return this.client.request<SpotifyPaging<{ track: SpotifyTrack }>>(`/playlists/${id}/tracks`, { limit, offset });
  }

  /**
   * Returns an async iterator to paginate over tracks in a playlist.
   */
  public async *getTracksIterator(id: string, limit: number = 20): AsyncGenerator<SpotifyTrack, void, unknown> {
    const generator = this.paginate<{ track: SpotifyTrack }>((offset) => this.getTracks(id, limit, offset));
    for await (const item of generator) {
      if (item.track) {
        yield item.track;
      }
    }
  }
}
