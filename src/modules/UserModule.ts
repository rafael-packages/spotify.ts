import { BaseModule } from './BaseModule';
import type { SpotifyUser, SpotifyPlaylist, SpotifyPaging, SpotifyArtist, SpotifyTrack, SpotifyAlbum } from '../types';

/**
 * UserModule
 * Tudo sobre perfis do Spotify. Perfil público e perfil do usuário logado (se usar User Token).
 */
export class UserModule extends BaseModule {
  /**
   * Pega o perfil público de um usuário pelo ID.
   */
  public async get(id: string): Promise<SpotifyUser> {
    return this.client.request<SpotifyUser>(`/users/${id}`);
  }

  /**
   * Pega as playlists de um usuário público.
   */
  public async getPlaylists(id: string, limit: number = 20): Promise<SpotifyPaging<SpotifyPlaylist>> {
    return this.client.request<SpotifyPaging<SpotifyPlaylist>>(`/users/${id}/playlists`, { limit });
  }

  // --- MÉTODOS QUE REQUEREM USER TOKEN AUTENTICADO ---

  /**
   * Retorna os dados do próprio usuário autenticado.
   */
  public async me(): Promise<SpotifyUser> {
    return this.client.request<SpotifyUser>(`/me`);
  }

  /**
   * Retorna os artistas ou músicas mais escutados pelo usuário.
   */
  public async topItems(type: 'artists' | 'tracks', time_range: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<SpotifyPaging<any>> {
    return this.client.request<SpotifyPaging<any>>(`/me/top/${type}`, { time_range, limit });
  }

  /**
   * Retorna os álbuns salvos na biblioteca (Library) do usuário.
   */
  public async savedAlbums(limit: number = 20): Promise<SpotifyPaging<{ added_at: string; album: SpotifyAlbum }>> {
    return this.client.request<SpotifyPaging<{ added_at: string; album: SpotifyAlbum }>>(`/me/albums`, { limit });
  }

  /**
   * Retorna as músicas salvas na biblioteca (Liked Songs).
   */
  public async savedTracks(limit: number = 20): Promise<SpotifyPaging<{ added_at: string; track: SpotifyTrack }>> {
    return this.client.request<SpotifyPaging<{ added_at: string; track: SpotifyTrack }>>(`/me/tracks`, { limit });
  }

  /**
   * Segue a lista de artistas ou usuários passados.
   */
  public async follow(type: 'artist' | 'user', ids: string[]): Promise<void> {
    await this.client.rawRequest(`/me/following?type=${type}&ids=${ids.join(',')}`, { method: 'PUT' });
  }

  /**
   * Deixa de seguir os artistas ou usuários.
   */
  public async unfollow(type: 'artist' | 'user', ids: string[]): Promise<void> {
    await this.client.rawRequest(`/me/following?type=${type}&ids=${ids.join(',')}`, { method: 'DELETE' });
  }
}
