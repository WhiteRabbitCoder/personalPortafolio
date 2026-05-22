#!/usr/bin/env node

// Helper script to get a Spotify refresh token.
// Usage: node scripts/get-spotify-token.mjs
//
// Prerequisites:
// 1. Create a Spotify app at https://developer.spotify.com/dashboard
// 2. Add http://localhost:8888/callback as a Redirect URI
// 3. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET env vars (or pass as args)

import http from 'node:http';
import { URL } from 'node:url';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Usage: SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/get-spotify-token.mjs');
  console.error('  or:  node scripts/get-spotify-token.mjs <client_id> <client_secret>');
  process.exit(1);
}

const PORT = 8888;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-top-read',
  'user-read-recently-played',
].join(' ');

const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', SCOPES);

console.log('\n1. Open this URL in your browser:\n');
console.log(`   ${authUrl.toString()}\n`);
console.log(`2. Authorize the app, then you'll be redirected back here.\n`);
console.log(`Waiting for callback on http://localhost:${PORT}...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (!url.pathname.startsWith('/callback')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  if (!code) {
    res.writeHead(400);
    res.end('Missing code parameter');
    return;
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    const data = await tokenRes.json();

    if (data.error) {
      console.error('Error:', data.error, data.error_description);
      res.writeHead(400);
      res.end(`Error: ${data.error_description}`);
      server.close();
      return;
    }

    console.log('='.repeat(60));
    console.log('SUCCESS! Add these to your Cloudflare Pages env vars:');
    console.log('='.repeat(60));
    console.log(`\nSPOTIFY_CLIENT_ID=${CLIENT_ID}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    console.log('For local dev, add them to .dev.vars in the project root.');
    console.log('='.repeat(60));

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Done!</h1><p>Check your terminal for the tokens. You can close this tab.</p>');
  } catch (err) {
    console.error('Failed to exchange code:', err);
    res.writeHead(500);
    res.end('Token exchange failed');
  }

  server.close();
});

server.listen(PORT);
