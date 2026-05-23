import { BaseModule } from './BaseModule';
import type { SpotifyUser, SpotifyPlaylist, SpotifyPaging } from '../types';

export class UserModule extends BaseModule {
  public async get(id: string): Promise<SpotifyUser> {
    return this.client.request<SpotifyUser>(`/users/${id}`);
  }

  public async getPlaylists(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyPlaylist>> {
    return this.client.request<SpotifyPaging<SpotifyPlaylist>>(`/users/${id}/playlists`, { limit });
  }
}
