# @rafaelsilvadeveloper/spotify.ts

The definitive client for the Spotify API, 100% typed, covering the entire catalog and authentication, without depending on any third-party libraries.

## Features

- 🛡️ **100% API Mapped**: Albums, Artists, Tracks, Playlists, Users, Podcasts, Episodes, Audiobooks, Chapters, Categories, Genres, Markets, and Player.
- 📦 **Zero Dependencies**: Built on native `fetch`. Runs smoothly in Node.js, Bun, Edge, or Serverless.
- 🔑 **Automatic and Manual Authentication**: Full support for **Client Credentials** (public) managed automatically and **User Token** (for player and private data via OAuth2).
- 🚦 **Rate Limiting and Cache**: Built-in request queue so you don't get 429 blocked and in-memory cache to optimize response times.
- 🔄 **Async Iterators**: Page-fetch search results, playlist tracks, artist albums, and user library items seamlessly using modern `for await...of` loops.

## Installation

```bash
npm install @rafaelsilvadeveloper/spotify.ts
```

## Usage: Public Access (Client Credentials)

You will need a `Client ID` and a `Client Secret` from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

```typescript
import { SpotifyClient } from '@rafaelsilvadeveloper/spotify.ts';

const client = new SpotifyClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

async function run() {
  // Fetch artist data
  const artist = await client.artists.get('4tZwfgrHOc3mvqYlEYSvVi'); // Daft Punk

  // Recommendations and Audio Features of a track
  const features = await client.tracks.getAudioFeatures('1jJci4qxiYcOB3o2xEsnCG');
  
  // Fetch podcasts and audiobooks
  const podcast = await client.shows.get('some_show_id');
  const chapters = await client.audiobooks.getChapters('some_book_id');
}
```

## Usage: Private Access (User Token / Player)

If you need to read the user's personal library, view history, or control the Player (Play/Pause), you need to provide the User Token authenticated by the user.

```typescript
import { SpotifyClient } from '@rafaelsilvadeveloper/spotify.ts';

const client = new SpotifyClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

// You can use the native auth module to generate the login
const loginUrl = client.auth.getLoginUrl('http://localhost/callback', ['user-modify-playback-state', 'user-library-read']);

// After exchanging the code, you tell the client to use this logged-in user token:
client.setUserToken('BQC...logged_in_user_token');

// And now you have access to the magic!
await client.player.play();
await client.player.next();
await client.users.follow('artist', ['4tZwfgrHOc3mvqYlEYSvVi']);
const savedAlbums = await client.users.savedAlbums();
```

## Pagination with Async Iterators

You can iterate through paginated items (search results, playlist tracks, library items) without manually managing limits or offsets:

```typescript
import { SpotifyClient } from '@rafaelsilvadeveloper/spotify.ts';

const client = new SpotifyClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

async function run() {
  // Automatically fetches next pages as you loop!
  for await (const track of client.search.tracksIterator('Daft Punk')) {
    console.log(`Track: ${track.name} - URI: ${track.uri}`);
  }
}

run();
```

Available iterators:
- `client.search.tracksIterator(query)`
- `client.search.albumsIterator(query)`
- `client.search.artistsIterator(query)`
- `client.playlists.getTracksIterator(id)`
- `client.artists.getAlbumsIterator(id)`
- `client.users.getPlaylistsIterator(id)`
- `client.users.topArtistsIterator(time_range)`
- `client.users.topTracksIterator(time_range)`
- `client.users.savedAlbumsIterator()`
- `client.users.savedTracksIterator()`

## Support

For support, questions, or discussions, join our Discord server:

[![Discord Server](https://img.shields.io/discord/1111111111?color=7289da&label=Discord&logo=discord)](https://discord.gg/7Fw7snafYS)

## License
MIT
