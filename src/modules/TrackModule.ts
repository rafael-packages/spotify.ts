import { BaseModule } from './BaseModule';
import type { SpotifyTrack, SpotifyAudioFeatures } from '../types';

/**
 * TrackModule
 * Tudo sobre músicas (tracks), audio features e análises profundas.
 */
export class TrackModule extends BaseModule {
  /**
   * Pega os metadados de uma música.
   */
  public async get(id: string): Promise<SpotifyTrack> {
    return this.client.request<SpotifyTrack>(`/tracks/${id}`);
  }

  /**
   * Pega várias músicas de uma vez.
   */
  public async getMultiple(ids: string[], market: string = 'US'): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/tracks`, { ids: ids.join(','), market });
  }

  /**
   * Traz as "Audio Features" da música (danceability, energy, acousticness, etc).
   */
  public async getAudioFeatures(id: string): Promise<SpotifyAudioFeatures> {
    return this.client.request<SpotifyAudioFeatures>(`/audio-features/${id}`);
  }

  /**
   * Traz as Audio Features de várias músicas de uma vez.
   */
  public async getAudioFeaturesMultiple(ids: string[]): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
    return this.client.request<{ audio_features: SpotifyAudioFeatures[] }>(`/audio-features`, { ids: ids.join(',') });
  }

  /**
   * Análise sônica detalhada de uma track (beats, tatum, pitches).
   */
  public async getAudioAnalysis(id: string): Promise<any> {
    return this.client.request<any>(`/audio-analysis/${id}`);
  }

  /**
   * Motor de recomendação do Spotify: gera uma lista de músicas baseado em seeds de artistas, tracks ou generos.
   */
  public async getRecommendations(options: { seed_artists?: string; seed_genres?: string; seed_tracks?: string; limit?: number; market?: string }): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/recommendations`, options);
  }
}
