import { RateLimiter } from './utils/RateLimiter';
import { CacheStore } from './utils/CacheStore';
import { SpotifyError } from './errors/SpotifyError';
import type { SpotifyOptions, RequestInterceptor, ResponseInterceptor } from './types';

import { AlbumModule } from './modules/AlbumModule';
import { ArtistModule } from './modules/ArtistModule';
import { AudiobooksModule } from './modules/AudiobooksModule';
import { AuthModule } from './modules/AuthModule';
import { CategoriesModule } from './modules/CategoriesModule';
import { ChaptersModule } from './modules/ChaptersModule';
import { EpisodesModule } from './modules/EpisodesModule';
import { GenresModule } from './modules/GenresModule';
import { MarketsModule } from './modules/MarketsModule';
import { PlayerModule } from './modules/PlayerModule';
import { PlaylistModule } from './modules/PlaylistModule';
import { SearchModule } from './modules/SearchModule';
import { ShowsModule } from './modules/ShowsModule';
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

  private clientCredentialsToken: string | null = null;
  private tokenExpiry: number = 0;

  // Um token passado manualmente pelo programador (ex: pegou no frontend com o login do usuário)
  private manualUserToken: string | null = null;

  public readonly albums: AlbumModule;
  public readonly artists: ArtistModule;
  public readonly audiobooks: AudiobooksModule;
  public readonly auth: AuthModule;
  public readonly categories: CategoriesModule;
  public readonly chapters: ChaptersModule;
  public readonly episodes: EpisodesModule;
  public readonly genres: GenresModule;
  public readonly markets: MarketsModule;
  public readonly player: PlayerModule;
  public readonly playlists: PlaylistModule;
  public readonly search: SearchModule;
  public readonly shows: ShowsModule;
  public readonly tracks: TrackModule;
  public readonly users: UserModule;

  constructor(options: SpotifyOptions) {
    if (!options.clientId || !options.clientSecret) {
      throw new SpotifyError('clientId e clientSecret são obrigatórios');
    }

    this.options = {
      timeout: 5000,
      maxRequestsPerSecond: 10,
      ...options
    };
    
    this.rateLimiter = new RateLimiter(this.options.maxRequestsPerSecond, 1000);
    this.cache = new CacheStore(60);

    this.albums = new AlbumModule(this);
    this.artists = new ArtistModule(this);
    this.audiobooks = new AudiobooksModule(this);
    this.auth = new AuthModule(this);
    this.categories = new CategoriesModule(this);
    this.chapters = new ChaptersModule(this);
    this.episodes = new EpisodesModule(this);
    this.genres = new GenresModule(this);
    this.markets = new MarketsModule(this);
    this.player = new PlayerModule(this);
    this.playlists = new PlaylistModule(this);
    this.search = new SearchModule(this);
    this.shows = new ShowsModule(this);
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

  /**
   * Seta o User Token gerado pelo fluxo de login oauth para acessar playlists privadas, player, etc.
   */
  public setUserToken(token: string): void {
    this.manualUserToken = token;
  }

  /**
   * Busca um token de acesso de sistema (Client Credentials) para pegar dados públicos.
   */
  private async getClientToken(): Promise<string> {
    if (this.clientCredentialsToken && Date.now() < this.tokenExpiry) {
      return this.clientCredentialsToken;
    }

    const authBase64 = btoa(`${this.options.clientId}:${this.options.clientSecret}`);
    
    const response = await fetch(SpotifyClient.AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SpotifyError(
        errorData.error_description || 'Falha na autenticação (Client Credentials) do Spotify',
        response.status
      );
    }

    const data = await response.json() as any;
    this.clientCredentialsToken = data.access_token;
    // Expira em 1h, reduzindo 1min por margem de erro
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return this.clientCredentialsToken!;
  }

  /**
   * Despacha uma requisição bruta (usada internamente por métodos como POST/PUT).
   */
  public async rawRequest(endpoint: string, fetchOptions: RequestInit): Promise<Response> {
    const url = new URL(`${SpotifyClient.API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    let requestUrl = url.toString();
    const token = this.manualUserToken || await this.getClientToken();

    let requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...fetchOptions.headers
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
            // Ignora parser error
          }
          throw new SpotifyError(errorMsg, response.status);
        }

        return response;
      } catch (error: any) {
        if (error.name === 'AbortError') throw new SpotifyError('A requisição excedeu o tempo limite (timeout).');
        if (error instanceof SpotifyError) throw error;
        throw new SpotifyError(`Falha na requisição: ${error.message}`);
      }
    };

    return this.rateLimiter.schedule(executeRequest);
  }

  /**
   * Helper genérico padrão para todas as GETs cacheadas.
   */
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

    const response = await this.rawRequest(urlString, { method: 'GET' });
    let data = await response.json() as any;

    for (const interceptor of this.responseInterceptors) {
      data = await interceptor(data);
    }

    if (options.cache !== false) {
      this.cache.set(urlString, data, options.ttl);
    }

    return data as T;
  }
}
