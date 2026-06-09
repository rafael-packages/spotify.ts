import { BaseModule } from './BaseModule';
import type { SpotifyUser, SpotifyPlaylist, SpotifyPaging, SpotifyArtist, SpotifyTrack, SpotifyAlbum } from '../types';

/**
 * UserModule
 * Handles Spotify user profiles, both public and authenticated user profiles (using User Token).
 */
export class UserModule extends BaseModule {
  /**
   * Fetch public user profile data by ID.
   */
  public async get(id: string): Promise<SpotifyUser> {
    return this.client.request<SpotifyUser>(`/users/${id}`);
  }

  /**
   * Fetch playlists of a public user.
   */
  public async getPlaylists(
    id: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<SpotifyPlaylist>> {
    return this.client.request<SpotifyPaging<SpotifyPlaylist>>(`/users/${id}/playlists`, { limit, offset });
  }

  /**
   * Returns an async iterator to paginate over public user's playlists.
   */
  public getPlaylistsIterator(id: string, limit: number = 20): AsyncGenerator<SpotifyPlaylist, void, unknown> {
    return this.paginate<SpotifyPlaylist>((offset) => this.getPlaylists(id, limit, offset));
  }

  // --- USER AUTHENTICATED METHODS (REQUIRES USER OAUTH TOKEN) ---

  /**
   * Fetch details of the authenticated user.
   */
  public async me(): Promise<SpotifyUser> {
    return this.client.request<SpotifyUser>(`/me`);
  }

  /**
   * Fetch top artists or tracks of the user.
   */
  public async topItems(
    type: 'artists' | 'tracks',
    time_range: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<any>> {
    return this.client.request<SpotifyPaging<any>>(`/me/top/${type}`, { time_range, limit, offset });
  }

  /**
   * Returns an async iterator to paginate over user's top artists.
   */
  public topArtistsIterator(
    time_range: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): AsyncGenerator<SpotifyArtist, void, unknown> {
    return this.paginate<SpotifyArtist>((offset) => this.topItems('artists', time_range, limit, offset));
  }

  /**
   * Returns an async iterator to paginate over user's top tracks.
   */
  public topTracksIterator(
    time_range: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): AsyncGenerator<SpotifyTrack, void, unknown> {
    return this.paginate<SpotifyTrack>((offset) => this.topItems('tracks', time_range, limit, offset));
  }

  /**
   * Fetch albums saved in the user's library.
   */
  public async savedAlbums(
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<{ added_at: string; album: SpotifyAlbum }>> {
    return this.client.request<SpotifyPaging<{ added_at: string; album: SpotifyAlbum }>>(`/me/albums`, { limit, offset });
  }

  /**
   * Returns an async iterator to paginate over user's saved albums.
   */
  public async *savedAlbumsIterator(limit: number = 20): AsyncGenerator<SpotifyAlbum, void, unknown> {
    const generator = this.paginate<{ added_at: string; album: SpotifyAlbum }>((offset) => this.savedAlbums(limit, offset));
    for await (const item of generator) {
      if (item.album) {
        yield item.album;
      }
    }
  }

  /**
   * Fetch tracks saved in the user's library (Liked Songs).
   */
  public async savedTracks(
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifyPaging<{ added_at: string; track: SpotifyTrack }>> {
    return this.client.request<SpotifyPaging<{ added_at: string; track: SpotifyTrack }>>(`/me/tracks`, { limit, offset });
  }

  /**
   * Returns an async iterator to paginate over user's Liked Songs.
   */
  public async *savedTracksIterator(limit: number = 20): AsyncGenerator<SpotifyTrack, void, unknown> {
    const generator = this.paginate<{ added_at: string; track: SpotifyTrack }>((offset) => this.savedTracks(limit, offset));
    for await (const item of generator) {
      if (item.track) {
        yield item.track;
      }
    }
  }

  /**
   * Follow a list of artists or users.
   */
  public async follow(type: 'artist' | 'user', ids: string[]): Promise<void> {
    await this.client.rawRequest(`/me/following?type=${type}&ids=${ids.join(',')}`, { method: 'PUT' });
  }

  /**
   * Unfollow a list of artists or users.
   */
  public async unfollow(type: 'artist' | 'user', ids: string[]): Promise<void> {
    await this.client.rawRequest(`/me/following?type=${type}&ids=${ids.join(',')}`, { method: 'DELETE' });
  }
}
