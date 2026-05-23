import { describe, it, expect, beforeEach, mock, spyOn } from 'bun:test';
import { SpotifyClient } from '../src/SpotifyClient';
import { SpotifyError } from '../src/errors/SpotifyError';

describe('SpotifyClient', () => {
  let client: SpotifyClient;

  beforeEach(() => {
    client = new SpotifyClient({
      clientId: 'dummy-client-id',
      clientSecret: 'dummy-client-secret'
    });
    client.clearCache();
  });

  it('deve instanciar corretamente e jogar erro se faltar credenciais', () => {
    expect(client.albums).toBeDefined();
    
    expect(() => new SpotifyClient({} as any)).toThrow(SpotifyError);
  });

  it('deve autenticar e buscar um artista (Daft Punk)', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
      if (typeof url === 'string' && url.includes('accounts.spotify.com')) {
        return new Response(JSON.stringify({
          access_token: 'dummy-token',
          token_type: 'Bearer',
          expires_in: 3600
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      
      return new Response(JSON.stringify({
        id: '4tZwfgrHOc3mvqYlEYSvVi',
        name: 'Daft Punk',
        type: 'artist'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });

    const artist = await client.artists.get('4tZwfgrHOc3mvqYlEYSvVi');
    expect(artist.name).toBe('Daft Punk');
    expect(artist.id).toBe('4tZwfgrHOc3mvqYlEYSvVi');

    fetchSpy.mockRestore();
  });
});
