import { useEffect, useState, useCallback } from 'react';
import { Music, Play, Pause, ExternalLink, Clock, Disc3 } from 'lucide-react';

interface SpotifyImage {
  url: string;
}

interface SpotifyArtistRef {
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtistRef[];
  album: { name: string; images: SpotifyImage[] };
  duration_ms: number;
  external_urls: { spotify: string };
}

interface SpotifyProfile {
  display_name: string;
  images: SpotifyImage[];
  followers: { total: number };
  external_urls: { spotify: string };
}

interface NowPlaying {
  is_playing: boolean;
  item?: SpotifyTrack;
  progress_ms?: number;
}

interface TopTracks {
  items: SpotifyTrack[];
}

interface TopArtists {
  items: {
    id: string;
    name: string;
    images: SpotifyImage[];
    genres: string[];
    external_urls: { spotify: string };
  }[];
}

type Tab = 'tracks' | 'artists';

const API_BASE = '/api/spotify';

async function fetchSpotify<T>(type: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}?type=${type}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatMs(ms: number) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function TrackRow({ track, index }: { track: SpotifyTrack; index: number }) {
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-white/10"
    >
      <span className="w-5 text-right text-sm text-[#b3b3b3] group-hover:hidden">
        {index + 1}
      </span>
      <Play size={14} className="hidden w-5 text-white group-hover:block" />
      {track.album.images[2] ? (
        <img
          src={track.album.images[2].url}
          alt=""
          className="h-10 w-10 rounded"
          loading="lazy"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded bg-[#282828]">
          <Music size={16} className="text-[#b3b3b3]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{track.name}</p>
        <p className="truncate text-xs text-[#b3b3b3]">
          {track.artists.map((a) => a.name).join(', ')}
        </p>
      </div>
      <span className="hidden text-xs text-[#b3b3b3] sm:block">
        {track.album.name}
      </span>
      <span className="ml-4 text-xs text-[#b3b3b3]">
        {formatMs(track.duration_ms)}
      </span>
    </a>
  );
}

function ArtistCard({ artist }: { artist: TopArtists['items'][number] }) {
  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-3 rounded-xl bg-[#181818] p-4 transition-colors hover:bg-[#282828]"
    >
      {artist.images[1] ? (
        <img
          src={artist.images[1].url}
          alt=""
          className="h-24 w-24 rounded-full object-cover shadow-lg shadow-black/40"
          loading="lazy"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#282828]">
          <Music size={32} className="text-[#b3b3b3]" />
        </div>
      )}
      <div className="w-full text-center">
        <p className="truncate text-sm font-semibold text-white">{artist.name}</p>
        <p className="truncate text-[11px] text-[#b3b3b3]">
          {artist.genres.slice(0, 2).join(', ') || 'Artist'}
        </p>
      </div>
    </a>
  );
}

function NowPlayingBar({ data }: { data: NowPlaying | null }) {
  if (!data?.item) {
    return (
      <div className="flex h-[72px] items-center justify-center border-t border-[#282828] bg-[#181818] px-4">
        <p className="text-xs text-[#b3b3b3]">Nothing playing right now</p>
      </div>
    );
  }

  const track = data.item;
  const progress = data.progress_ms ?? 0;
  const pct = (progress / track.duration_ms) * 100;

  return (
    <div className="flex h-[72px] items-center gap-3 border-t border-[#282828] bg-[#181818] px-4">
      {track.album.images[2] ? (
        <img src={track.album.images[2].url} alt="" className="h-14 w-14 rounded" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded bg-[#282828]">
          <Music size={20} className="text-[#b3b3b3]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm text-white hover:underline"
        >
          {track.name}
        </a>
        <p className="truncate text-xs text-[#b3b3b3]">
          {track.artists.map((a) => a.name).join(', ')}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] text-[#b3b3b3]">{formatMs(progress)}</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#4d4d4d]">
            <div
              className="h-full rounded-full bg-[#1DB954] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-[#b3b3b3]">{formatMs(track.duration_ms)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {data.is_playing ? (
          <Pause size={18} className="text-white" />
        ) : (
          <Play size={18} className="text-[#b3b3b3]" />
        )}
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#121212] p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954]/20">
        <Music size={36} className="text-[#1DB954]" />
      </div>
      <h2 className="text-xl font-bold text-white">Spotify not connected</h2>
      <p className="max-w-sm text-center text-sm text-[#b3b3b3]">
        Set your Spotify API credentials in the environment to display your profile and
        currently playing music.
      </p>
      <div className="mt-2 w-full max-w-md rounded-lg bg-[#181818] p-4 font-mono text-xs text-[#b3b3b3]">
        <p className="mb-1 text-[#1DB954]"># Cloudflare Pages env vars</p>
        <p>SPOTIFY_CLIENT_ID=your_client_id</p>
        <p>SPOTIFY_CLIENT_SECRET=your_client_secret</p>
        <p>SPOTIFY_REFRESH_TOKEN=your_refresh_token</p>
      </div>
    </div>
  );
}

export function SpotifyApp() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [topTracks, setTopTracks] = useState<TopTracks | null>(null);
  const [topArtists, setTopArtists] = useState<TopArtists | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [tab, setTab] = useState<Tab>('tracks');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const profileData = await fetchSpotify<SpotifyProfile>('profile');
    if (!profileData) {
      setNotConfigured(true);
      setLoading(false);
      return;
    }
    setProfile(profileData);

    const [np, tracks, artists] = await Promise.all([
      fetchSpotify<NowPlaying>('now-playing'),
      fetchSpotify<TopTracks>('top-tracks'),
      fetchSpotify<TopArtists>('top-artists'),
    ]);
    setNowPlaying(np);
    setTopTracks(tracks);
    setTopArtists(artists);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const np = await fetchSpotify<NowPlaying>('now-playing');
      if (np) setNowPlaying(np);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (notConfigured) return <Placeholder />;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#121212]">
        <Disc3 size={32} className="animate-spin text-[#1DB954]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#121212]">
      <div className="min-h-0 flex-1 overflow-auto">
        {/* Profile header */}
        {profile && (
          <div
            className="flex items-end gap-5 p-6 pb-5"
            style={{
              background:
                'linear-gradient(to bottom, #1a3a2a 0%, #121212 100%)',
            }}
          >
            {profile.images[0] ? (
              <img
                src={profile.images[0].url}
                alt=""
                className="h-28 w-28 rounded-full object-cover shadow-xl shadow-black/50"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#282828] shadow-xl shadow-black/50">
                <Music size={40} className="text-[#b3b3b3]" />
              </div>
            )}
            <div className="min-w-0 pb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                Profile
              </p>
              <h1 className="truncate text-3xl font-black text-white">
                {profile.display_name}
              </h1>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm text-[#b3b3b3]">
                  {profile.followers.total.toLocaleString()} followers
                </span>
                <a
                  href={profile.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-[#1DB954] hover:underline"
                >
                  Open in Spotify <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 px-6 pb-2 pt-2">
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === 'tracks'
                ? 'bg-white text-black'
                : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
            onClick={() => setTab('tracks')}
          >
            Top Tracks
          </button>
          <button
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === 'artists'
                ? 'bg-white text-black'
                : 'bg-[#232323] text-white hover:bg-[#2a2a2a]'
            }`}
            onClick={() => setTab('artists')}
          >
            Top Artists
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {tab === 'tracks' && (
            <div>
              {/* Column header */}
              <div className="mb-1 flex items-center gap-3 border-b border-[#282828] px-3 py-2 text-[11px] uppercase tracking-wider text-[#b3b3b3]">
                <span className="w-5 text-right">#</span>
                <span className="w-10" />
                <span className="flex-1">Title</span>
                <span className="hidden sm:block">Album</span>
                <span className="ml-4 flex items-center">
                  <Clock size={12} />
                </span>
              </div>
              {topTracks?.items.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} />
              ))}
              {!topTracks?.items.length && (
                <p className="py-8 text-center text-sm text-[#b3b3b3]">
                  No top tracks available yet
                </p>
              )}
            </div>
          )}

          {tab === 'artists' && (
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
              {topArtists?.items.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
              {!topArtists?.items.length && (
                <p className="col-span-full py-8 text-center text-sm text-[#b3b3b3]">
                  No top artists available yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing bar */}
      <NowPlayingBar data={nowPlaying} />
    </div>
  );
}
