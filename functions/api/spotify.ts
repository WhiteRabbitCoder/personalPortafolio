interface Env {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
}

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API = 'https://api.spotify.com/v1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function getAccessToken(env: Env): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: env.SPOTIFY_REFRESH_TOKEN,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function spotifyFetch(endpoint: string, token: string) {
  const res = await fetch(`${SPOTIFY_API}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json();
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const url = new URL(context.request.url);
  const type = url.searchParams.get('type');

  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET || !env.SPOTIFY_REFRESH_TOKEN) {
    return Response.json(
      { error: 'not_configured', message: 'Spotify credentials not set' },
      { status: 503, headers: CORS_HEADERS }
    );
  }

  try {
    const token = await getAccessToken(env);

    let data: unknown;
    let cacheSeconds: number;

    switch (type) {
      case 'now-playing':
        data = await spotifyFetch('/me/player/currently-playing', token);
        cacheSeconds = 30;
        break;
      case 'profile':
        data = await spotifyFetch('/me', token);
        cacheSeconds = 3600;
        break;
      case 'top-tracks':
        data = await spotifyFetch('/me/top/tracks?limit=10&time_range=short_term', token);
        cacheSeconds = 300;
        break;
      case 'top-artists':
        data = await spotifyFetch('/me/top/artists?limit=6&time_range=short_term', token);
        cacheSeconds = 300;
        break;
      case 'recently-played':
        data = await spotifyFetch('/me/player/recently-played?limit=10', token);
        cacheSeconds = 60;
        break;
      default:
        return Response.json(
          { error: 'invalid_type', message: 'Use ?type=now-playing|profile|top-tracks|top-artists|recently-played' },
          { status: 400, headers: CORS_HEADERS }
        );
    }

    return Response.json(data ?? { is_playing: false }, {
      headers: {
        ...CORS_HEADERS,
        'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { error: 'spotify_error', message },
      { status: 502, headers: CORS_HEADERS }
    );
  }
};
