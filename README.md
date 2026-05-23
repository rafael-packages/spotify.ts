# spotify.ts

Um client completo, fortemente tipado e com zero dependências para a API do Spotify. Feito para TypeScript e Node.js/Bun.

## Características

- 🛡️ **Fortemente Tipado**: Tipos completos para os principais retornos da API.
- 📦 **Zero Dependências**: Usa apenas o `fetch` nativo.
- 🔐 **Autenticação Automática**: Gerencia e renova seu token de acesso `Client Credentials` automaticamente nos bastidores.
- 🚦 **Rate Limiting Embutido**: Evite ser bloqueado pela API do Spotify com o gerenciador de fila automático.
- 🚀 **Cache Automático**: Evite chamadas desnecessárias guardando as respostas na memória.

## Instalação

```bash
npm install github:realkalashnikov/spotify.ts
```

## Uso Básico

Você precisará de um `Client ID` e um `Client Secret` do [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

```typescript
import { SpotifyClient } from 'spotify.ts';

const client = new SpotifyClient({
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET'
});

async function run() {
  // Buscar um artista
  const artist = await client.artists.get('4tZwfgrHOc3mvqYlEYSvVi'); // Daft Punk
  console.log(artist.name);

  // Buscar os top tracks de um artista no Brasil
  const topTracks = await client.artists.getTopTracks('4tZwfgrHOc3mvqYlEYSvVi', 'BR');
  console.log(topTracks.tracks.map(track => track.name));
  
  // Fazer uma busca geral
  const searchResults = await client.search.get('Discovery');
  console.log(searchResults.albums?.items[0].name);
}

run();
```

## Licença

MIT
