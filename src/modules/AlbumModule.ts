import { BaseModule } from './BaseModule';
import type { SpotifyAlbum, SpotifyTrack, SpotifyPaging } from '../types';

export class AlbumModule extends BaseModule {
  public async get(id: string): Promise<SpotifyAlbum> {
    return this.client.request<SpotifyAlbum>(`/albums/${id}`);
  }

  public async getTracks(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyTrack>> {
    return this.client.request<SpotifyPaging<SpotifyTrack>>(`/albums/${id}/tracks`, { limit });
  }
}
