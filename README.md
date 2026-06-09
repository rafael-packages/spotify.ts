# @rafaelsilvadeveloper/spotify.ts

A strongly typed, zero-dependency TypeScript client for the Spotify API with automatic OAuth2 support, featuring rate limiting, caching, and async iterators.

[![NPM Version](https://img.shields.io/npm/v/@rafaelsilvadeveloper/spotify.ts.svg?style=flat-square)](https://www.npmjs.com/package/@rafaelsilvadeveloper/spotify.ts)
[![Discord Support](https://img.shields.io/discord/1111111111?color=7289da&label=Discord&logo=discord&style=flat-square)](https://discord.gg/7Fw7snafYS)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-blueviolet.svg?style=flat-square)](https://www.npmjs.com/package/@rafaelsilvadeveloper/spotify.ts)

## Features

*   🛡️ **100% API Coverage**: Fully typed requests and responses for Albums, Artists, Tracks, Playlists, Users, Podcasts, Episodes, Audiobooks, Chapters, Categories, Genres, and Markets.
*   📦 **Zero Dependencies**: Built entirely using native `fetch`. Runs in Node.js, Bun, Cloudflare Workers, Edge, and Serverless environments.
*   🔑 **OAuth2 Support**: Automatic and manual authentication. Client Credentials managed automatically; User Token supported for private library/player operations.
*   🚦 **Built-in Rate Limiting**: Automatic queue management to avoid Spotify API's 429 Rate Limit blocks.
*   🚀 **In-Memory Cache**: Smart built-in caching layer to save resources and speed up repeat requests.
*   🔌 **Custom Interceptors**: Flexible middlewares to intercept and modify requests/responses dynamically.
*   🔄 **Async Iterators**: Page-fetch search results, playlist tracks, and user library items seamlessly using modern `for await...of` loops.

## Installation

```bash
npm install @rafaelsilvadeveloper/spotify.ts
```

## Getting Started

### Public Access (Client Credentials)

You will need a `clientId` and `clientSecret` from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

```typescript
import { SpotifyClient } from '@rafaelsilvadeveloper/spotify.ts';

const client = new SpotifyClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

async function run() {
  // Fetch artist data
  const artist = await client.artists.get('4tZwfgrHOc3mvqYlEYSvVi'); // Daft Punk

  // Audio Features of a track
  const features = await client.tracks.getAudioFeatures('1jJci4qxiYcOB3o2xEsnCG');
}

run();
```

### Private Access (User Token / Player control)

```typescript
// Generate authorization URL
const loginUrl = client.auth.getLoginUrl('http://localhost/callback', ['user-modify-playback-state', 'user-library-read']);

// Exchange and set the user token
client.setUserToken('BQC...logged_in_user_token');

// Perform authorized player actions
await client.player.play();
await client.player.next();
```

## Pagination with Async Iterators

Iterate through paginated resources (like search results or playlist tracks) automatically without manually handling offsets or limit parameters:

```typescript
import { SpotifyClient } from '@rafaelsilvadeveloper/spotify.ts';

const client = new SpotifyClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

async function run() {
  // Automatically fetches next pages behind the scenes as you loop!
  for await (const track of client.search.tracksIterator('Daft Punk')) {
    console.log(`Track: ${track.name} - URI: ${track.uri}`);
  }
}

run();
```

## Error Handling

Throws strongly typed `SpotifyError` when the API returns an error structure.

```typescript
import { SpotifyError } from '@rafaelsilvadeveloper/spotify.ts';

try {
  await client.albums.get('non-existent-id');
} catch (error) {
  if (error instanceof SpotifyError) {
    console.error(`API Error: ${error.message} (Status: ${error.status})`);
  }
}
```

## Support

For support, questions, or discussions, join our Discord server:

[![Discord Server](https://img.shields.io/discord/1111111111?color=7289da&label=Discord&logo=discord&style=for-the-badge)](https://discord.gg/7Fw7snafYS)

## License
MIT
