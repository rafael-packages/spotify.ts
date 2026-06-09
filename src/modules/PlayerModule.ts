import { BaseModule } from './BaseModule';
import type { SpotifyTrack, SpotifyPaging } from '../types';

/**
 * PlayerModule
 * Direct operations on the user's player.
 * WARNING: Requires user authenticated token (OAuth via AuthModule)
 * with the appropriate scopes (`user-modify-playback-state`, `user-read-playback-state`, etc).
 */
export class PlayerModule extends BaseModule {
  /**
   * Start or resume playback.
   */
  public async play(options?: { context_uri?: string; uris?: string[]; offset?: { position: number } }): Promise<void> {
    await this.client.rawRequest('/me/player/play', { method: 'PUT', body: JSON.stringify(options || {}) });
  }

  /**
   * Pause playback.
   */
  public async pause(): Promise<void> {
    await this.client.rawRequest('/me/player/pause', { method: 'PUT' });
  }

  /**
   * Skip to next track.
   */
  public async next(): Promise<void> {
    await this.client.rawRequest('/me/player/next', { method: 'POST' });
  }

  /**
   * Skip to previous track.
   */
  public async previous(): Promise<void> {
    await this.client.rawRequest('/me/player/previous', { method: 'POST' });
  }

  /**
   * Fetch user's recently played tracks.
   */
  public async getRecentlyPlayed(limit: number = 20): Promise<SpotifyPaging<{ track: SpotifyTrack; played_at: string }>> {
    return this.client.request<SpotifyPaging<{ track: SpotifyTrack; played_at: string }>>(`/me/player/recently-played`, { limit });
  }

  /**
   * Add an item to the playback queue.
   */
  public async queue(uri: string): Promise<void> {
    await this.client.rawRequest(`/me/player/queue?uri=${encodeURIComponent(uri)}`, { method: 'POST' });
  }
}
