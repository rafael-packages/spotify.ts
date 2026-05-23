import { BaseModule } from './BaseModule';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyPaging } from '../types';

export class PlaylistModule extends BaseModule {
  public async get(id: string): Promise<SpotifyPlaylist> {
    return this.client.request<SpotifyPlaylist>(`/playlists/${id}`);
  }

  public async getTracks(id: string, limit: number = 20): Promise<SpotifyPaging<{ track: SpotifyTrack }>> {
    return this.client.request<SpotifyPaging<{ track: SpotifyTrack }>>(`/playlists/${id}/tracks`, { limit });
  }
}
