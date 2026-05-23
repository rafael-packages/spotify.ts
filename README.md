# spotify.ts

O client definitivo para a API do Spotify, 100% tipado, cobrindo todo o catálogo e autenticação, sem depender de nenhuma biblioteca de terceiros.

## Características

- 🛡️ **100% da API Mapeada**: Álbuns, Artistas, Tracks, Playlists, Usuários, Podcasts, Episódios, Audiobooks, Capítulos, Categorias, Gêneros, Mercados e Player.
- 📦 **Zero Dependências**: Feito no `fetch` nativo. Roda liso no Node.js, Bun, Edge ou Serverless.
- 🔑 **Autenticação Automática e Manual**: Suporte completo a **Client Credentials** (público) gerido automaticamente e **User Token** (para player e dados privados via OAuth2).
- 🚦 **Rate Limiting e Cache**: Fila de requests embutida pra você não tomar block 429 e cache em memória pra otimizar o tempo de resposta.

## Instalação

```bash
npm install github:realkalashnikov/spotify.ts
```

## Uso: Acesso Público (Client Credentials)

Você precisará de um `Client ID` e um `Client Secret` do [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

```typescript
import { SpotifyClient } from 'spotify.ts';

const client = new SpotifyClient({
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET'
});

async function run() {
  // Buscar os dados do artista
  const artist = await client.artists.get('4tZwfgrHOc3mvqYlEYSvVi'); // Daft Punk

  // Recomendações e Audio Features de uma música
  const features = await client.tracks.getAudioFeatures('1jJci4qxiYcOB3o2xEsnCG');
  
  // Buscar podcasts e audiobooks
  const podcast = await client.shows.get('some_show_id');
  const chapters = await client.audiobooks.getChapters('some_book_id');
}
```

## Uso: Acesso Privado (User Token / Player)

Se você precisa ler a biblioteca pessoal do usuário, ver histórico ou controlar o Player (Play/Pause), você precisa fornecer o User Token autenticado pelo usuário.

```typescript
// Você pode usar o módulo nativo auth para gerar o login
const loginUrl = client.auth.getLoginUrl('http://localhost/callback', ['user-modify-playback-state', 'user-library-read']);

// Depois de trocar o código, você diz pro client usar esse token do usuário:
client.setUserToken('BQC...token_do_usuario_logado');

// E agora você tem acesso à magia!
await client.player.play();
await client.player.next();
await client.users.follow('artist', ['4tZwfgrHOc3mvqYlEYSvVi']);
const savedAlbums = await client.users.savedAlbums();
```

## Licença
MIT
