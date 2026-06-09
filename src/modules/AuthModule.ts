import { BaseModule } from './BaseModule';

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * AuthModule
 * OAuth 2 authorization utilities for Spotify user authentication.
 */
export class AuthModule extends BaseModule {
  private readonly authUrl = 'https://accounts.spotify.com/authorize';
  private readonly tokenUrl = 'https://accounts.spotify.com/api/token';

  /**
   * Generate login URL to redirect the user to Spotify OAuth.
   */
  public getLoginUrl(redirectUri: string, scopes: string[] = [], state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.client.options.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange the authorization code returned by Spotify redirect callback for access and refresh tokens.
   */
  public async exchangeCode(code: string, redirectUri: string): Promise<SpotifyTokenResponse> {
    const auth = btoa(`${this.client.options.clientId}:${this.client.options.clientSecret}`);

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Refresh an expired access token using the refresh token.
   */
  public async refreshToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const auth = btoa(`${this.client.options.clientId}:${this.client.options.clientSecret}`);

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return response.json();
  }
}
