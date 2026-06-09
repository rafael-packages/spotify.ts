import { BaseModule } from './BaseModule';
import type { SpotifyTrack, SpotifyAudioFeatures } from '../types';

/**
 * TrackModule
 * Access music tracks, audio features, and deeper sonic analysis.
 */
export class TrackModule extends BaseModule {
  /**
   * Fetch metadata of a track by ID.
   */
  public async get(id: string): Promise<SpotifyTrack> {
    return this.client.request<SpotifyTrack>(`/tracks/${id}`);
  }

  /**
   * Fetch multiple tracks at once.
   */
  public async getMultiple(
    ids: string[],
    market: string = 'US'
  ): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/tracks`, {
      ids: ids.join(','),
      market,
    });
  }

  /**
   * Fetch audio features (danceability, energy, acousticness, etc) of a track.
   */
  public async getAudioFeatures(id: string): Promise<SpotifyAudioFeatures> {
    return this.client.request<SpotifyAudioFeatures>(`/audio-features/${id}`);
  }

  /**
   * Fetch audio features for multiple tracks.
   */
  public async getAudioFeaturesMultiple(
    ids: string[]
  ): Promise<{ audio_features: SpotifyAudioFeatures[] }> {
    return this.client.request<{ audio_features: SpotifyAudioFeatures[] }>(`/audio-features`, {
      ids: ids.join(','),
    });
  }

  /**
   * Detailed audio analysis of a track (beats, tatums, pitches).
   */
  public async getAudioAnalysis(id: string): Promise<any> {
    return this.client.request<any>(`/audio-analysis/${id}`);
  }

  /**
   * Generate recommendations based on seed artists, tracks, or genres.
   */
  public async getRecommendations(options: {
    seed_artists?: string;
    seed_genres?: string;
    seed_tracks?: string;
    limit?: number;
    market?: string;
  }): Promise<{ tracks: SpotifyTrack[] }> {
    return this.client.request<{ tracks: SpotifyTrack[] }>(`/recommendations`, options);
  }
}
