import { RateLimiter } from './utils/RateLimiter';
import { CacheStore } from './utils/CacheStore';
import { SpotifyError } from './errors/SpotifyError';
import type { SpotifyOptions, RequestInterceptor, ResponseInterceptor } from './types';

import { AlbumModule } from './modules/AlbumModule';
import { ArtistModule } from './modules/ArtistModule';
import { PlaylistModule } from './modules/PlaylistModule';
import { SearchModule } from './modules/SearchModule';
import { TrackModule } from './modules/TrackModule';
import { UserModule } from './modules/UserModule';

export class SpotifyClient {
  private static readonly API_URL = 'https://api.spotify.com/v1';
  private static readonly AUTH_URL = 'https://accounts.spotify.com/api/token';
  
  private rateLimiter: RateLimiter;
  private cache: CacheStore;
  public options: SpotifyOptions;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  public readonly albums: AlbumModule;
  public readonly artists: ArtistModule;
  public readonly playlists: PlaylistModule;
  public readonly search: SearchModule;
  public readonly tracks: TrackModule;
  public readonly users: UserModule;

  constructor(options: SpotifyOptions) {
    if (!options.clientId || !options.clientSecret) {
      throw new SpotifyError('clientId e clientSecret são obrigatórios');
    }

    this.options = {
      timeout: 5000,
      maxRequestsPerSecond: 10, // Spotify recomenda limites razoáveis
      ...options
    };
    
    this.rateLimiter = new RateLimiter(this.options.maxRequestsPerSecond, 1000);
    this.cache = new CacheStore(60);

    this.albums = new AlbumModule(this);
    this.artists = new ArtistModule(this);
    this.playlists = new PlaylistModule(this);
    this.search = new SearchModule(this);
    this.tracks = new TrackModule(this);
    this.users = new UserModule(this);
  }

  public useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = btoa(`${this.options.clientId}:${this.options.clientSecret}`);
    
    const response = await fetch(SpotifyClient.AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SpotifyError(
        errorData.error_description || 'Falha na autenticação do Spotify',
        response.status
      );
    }

    const data = await response.json() as any;
    this.accessToken = data.access_token;
    // O tempo de expiração geralmente é 3600 segundos (1 hora). Subtraímos 60 segundos para margem de segurança.
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return this.accessToken!;
  }

  public async request<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options: { cache?: boolean; ttl?: number } = {}
  ): Promise<T> {
    const url = new URL(`${SpotifyClient.API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const urlString = url.toString();

    if (options.cache !== false) {
      const cached = this.cache.get<T>(urlString);
      if (cached) return cached;
    }

    let requestUrl = urlString;
    const token = await this.getAccessToken();

    let requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    if (this.options.timeout) {
      const controller = new AbortController();
      requestOptions.signal = controller.signal;
      setTimeout(() => controller.abort(), this.options.timeout);
    }

    for (const interceptor of this.requestInterceptors) {
      const [newUrl, newOptions] = await interceptor(requestUrl, requestOptions);
      requestUrl = newUrl;
      requestOptions = newOptions;
    }

    const executeRequest = async () => {
      try {
        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
          let errorMsg = `HTTP Error: ${response.status} ${response.statusText}`;
          try {
            const errData = await response.json() as any;
            if (errData.error && errData.error.message) {
              errorMsg = errData.error.message;
            }
          } catch (e) {
            // Ignorar erro no parse
          }
          throw new SpotifyError(errorMsg, response.status);
        }

        let data = await response.json() as any;

        for (const interceptor of this.responseInterceptors) {
          data = await interceptor(data);
        }

        if (options.cache !== false) {
          this.cache.set(urlString, data, options.ttl);
        }

        return data as T;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new SpotifyError('A requisição excedeu o tempo limite (timeout).');
        }
        if (error instanceof SpotifyError) {
          throw error;
        }
        throw new SpotifyError(`Falha na requisição: ${error.message}`);
      }
    };

    return this.rateLimiter.schedule(executeRequest);
  }
}
