import { BaseModule } from './BaseModule';
import type { SpotifyTrack } from '../types';

export class TrackModule extends BaseModule {
  public async get(id: string): Promise<SpotifyTrack> {
    return this.client.request<SpotifyTrack>(`/tracks/${id}`);
  }
}
