import { BaseModule } from './BaseModule';
import type { SpotifyTrack, SpotifyPaging } from '../types';

/**
 * PlayerModule
 * Ações diretas no player do usuário. 
 * ATENÇÃO: Requer autenticação de usuário (User Token via AuthModule) 
 * com os devidos scopes (`user-modify-playback-state`, `user-read-playback-state`, etc).
 */
export class PlayerModule extends BaseModule {
  /**
   * Dá play na música!
   */
  public async play(options?: { context_uri?: string; uris?: string[]; offset?: { position: number } }): Promise<void> {
    // Como a API não tem um método genérico no nosso client para PUT/POST (já que fizemos focado em GET),
    // vamos usar um fetch direto do client pra essas ações destrutivas/modificadoras.
    await this.client.rawRequest('/me/player/play', { method: 'PUT', body: JSON.stringify(options || {}) });
  }

  /**
   * Pausa a música tocando no momento.
   */
  public async pause(): Promise<void> {
    await this.client.rawRequest('/me/player/pause', { method: 'PUT' });
  }

  /**
   * Pula pra próxima faixa.
   */
  public async next(): Promise<void> {
    await this.client.rawRequest('/me/player/next', { method: 'POST' });
  }

  /**
   * Volta pra faixa anterior.
   */
  public async previous(): Promise<void> {
    await this.client.rawRequest('/me/player/previous', { method: 'POST' });
  }

  /**
   * Retorna os últimos tracks escutados (histórico de reprodução).
   */
  public async getRecentlyPlayed(limit: number = 20): Promise<SpotifyPaging<{ track: SpotifyTrack; played_at: string }>> {
    return this.client.request<SpotifyPaging<{ track: SpotifyTrack; played_at: string }>>(`/me/player/recently-played`, { limit });
  }

  /**
   * Adiciona um item na fila.
   */
  public async queue(uri: string): Promise<void> {
    await this.client.rawRequest(`/me/player/queue?uri=${encodeURIComponent(uri)}`, { method: 'POST' });
  }
}
