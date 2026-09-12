// Looks up each song on Spotify and caches its real track URL locally so the
// site can build without network access or secrets at build time.
//
// Note: Spotify locked the track `popularity` field behind "Extended Quota
// Mode" in late 2024, which isn't self-serve, so a personal Client ID/secret
// can only fetch the track URL, not a popularity score.
//
// Usage: npm run fetch:spotify
// Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { allSongs, songSlug } from '../src/data/songs.ts';

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/spotify-popularity.json', import.meta.url));

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET. Add them to .env first.');
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function searchTrack(token, title, artist) {
  const query = `track:${title} artist:${artist}`;
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    throw new Error(`Search failed for "${title}" by ${artist}: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.tracks?.items?.[0];
}

async function main() {
  const token = await getAccessToken();

  const uniqueSongs = new Map();
  for (const song of allSongs()) {
    uniqueSongs.set(songSlug(song), song);
  }

  const result = {};
  let found = 0;
  for (const [slug, song] of uniqueSongs) {
    try {
      const track = await searchTrack(token, song.title, song.artist);
      if (track) {
        result[slug] = { url: track.external_urls.spotify };
        found += 1;
        console.log(`✓ ${song.artist} - ${song.title}`);
      } else {
        console.warn(`✗ No match on Spotify for ${song.artist} - ${song.title}`);
      }
    } catch (err) {
      console.warn(`✗ ${song.artist} - ${song.title}: ${err.message}`);
    }
    // Stay well under Spotify's rate limits.
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`\nSaved track links for ${found}/${uniqueSongs.size} songs to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
