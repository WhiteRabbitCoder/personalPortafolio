import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  ExternalLink,
  Clock,
  Disc3,
  History,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
} from 'lucide-react';

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

interface RecentlyPlayed {
  items: {
    track: SpotifyTrack;
    played_at: string;
  }[];
}

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

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function useRealtimeProgress(nowPlaying: NowPlaying | null) {
  const [progress, setProgress] = useState(0);
  const lastSyncRef = useRef<{ progress: number; time: number; trackId: string } | null>(null);

  useEffect(() => {
    if (!nowPlaying?.item) {
      setProgress(0);
      lastSyncRef.current = null;
      return;
    }

    const serverProgress = nowPlaying.progress_ms ?? 0;
    const trackId = nowPlaying.item.id;

    lastSyncRef.current = {
      progress: serverProgress,
      time: Date.now(),
      trackId,
    };
    setProgress(serverProgress);
  }, [nowPlaying]);

  useEffect(() => {
    if (!nowPlaying?.item || !nowPlaying.is_playing) return;

    const duration = nowPlaying.item.duration_ms;
    const interval = setInterval(() => {
      const sync = lastSyncRef.current;
      if (!sync) return;
      const elapsed = Date.now() - sync.time;
      const current = Math.min(sync.progress + elapsed, duration);
      setProgress(current);
    }, 1000);

    return () => clearInterval(interval);
  }, [nowPlaying]);

  return progress;
}

function TrackRow({
  track,
  index,
  playedAt,
}: {
  track: SpotifyTrack;
  index: number;
  playedAt?: string;
}) {
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
    >
      <span className="w-5 text-right text-sm tabular-nums text-[#b3b3b3] group-hover:hidden">
        {index + 1}
      </span>
      <Play
        size={14}
        className="hidden w-5 text-white group-hover:block"
      />
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
      <span className="hidden truncate text-xs text-[#b3b3b3] sm:block">
        {track.album.name}
      </span>
      <span className="ml-4 shrink-0 text-xs tabular-nums text-[#b3b3b3]">
        {playedAt ? formatTimeAgo(playedAt) : formatMs(track.duration_ms)}
      </span>
    </a>
  );
}

function NowPlayingBar({
  data,
  progress,
}: {
  data: NowPlaying | null;
  progress: number;
}) {
  if (!data?.item) {
    return (
      <div className="flex h-[90px] items-center justify-center rounded-lg bg-[#181818] px-4">
        <p className="text-xs text-[#b3b3b3]">Nothing playing right now</p>
      </div>
    );
  }

  const track = data.item;
  const pct = (progress / track.duration_ms) * 100;

  return (
    <div className="rounded-lg bg-[#181818] px-4 py-2">
      <div className="grid h-full grid-cols-[1fr_2fr_1fr] items-center gap-4">
        {/* Left — track info */}
        <div className="flex min-w-0 items-center gap-3">
          {track.album.images[2] ? (
            <img
              src={track.album.images[2].url}
              alt=""
              className="h-14 w-14 shrink-0 rounded shadow-md shadow-black/30"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-[#282828]">
              <Music size={20} className="text-[#b3b3b3]" />
            </div>
          )}
          <div className="min-w-0">
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-medium text-white hover:underline"
            >
              {track.name}
            </a>
            <p className="truncate text-[11px] text-[#b3b3b3]">
              {track.artists.map((a) => a.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Center — controls + progress */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <Shuffle size={14} className="text-[#b3b3b3] transition-colors hover:text-white" />
            <SkipBack size={16} className="fill-current text-[#b3b3b3] transition-colors hover:text-white" />
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform hover:scale-105">
              {data.is_playing ? (
                <Pause size={16} className="text-black" />
              ) : (
                <Play size={16} className="ml-0.5 text-black" />
              )}
            </button>
            <SkipForward size={16} className="fill-current text-[#b3b3b3] transition-colors hover:text-white" />
            <Repeat size={14} className="text-[#b3b3b3] transition-colors hover:text-white" />
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="w-10 text-right text-[11px] tabular-nums text-[#b3b3b3]">
              {formatMs(progress)}
            </span>
            <div className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000 group-hover:bg-[#1DB954]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-[11px] tabular-nums text-[#b3b3b3]">
              {formatMs(track.duration_ms)}
            </span>
          </div>
        </div>

        {/* Right — volume */}
        <div className="flex items-center justify-center gap-2">
          <Volume2 size={16} className="text-[#b3b3b3]" />
          <div className="group relative h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-white group-hover:bg-[#1DB954]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg bg-[#121212] p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954]/20">
        <Music size={36} className="text-[#1DB954]" />
      </div>
      <h2 className="text-xl font-bold text-white">
        Spotify not connected
      </h2>
      <p className="max-w-sm text-center text-sm text-[#b3b3b3]">
        Set your Spotify API credentials in the environment to display your
        profile and currently playing music.
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
  const [recentlyPlayed, setRecentlyPlayed] =
    useState<RecentlyPlayed | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  const progress = useRealtimeProgress(nowPlaying);

  const fetchAll = useCallback(async () => {
    const profileData =
      await fetchSpotify<SpotifyProfile>('profile');
    if (!profileData) {
      setNotConfigured(true);
      setLoading(false);
      return;
    }
    setProfile(profileData);

    const [np, recent] = await Promise.all([
      fetchSpotify<NowPlaying>('now-playing'),
      fetchSpotify<RecentlyPlayed>('recently-played'),
    ]);
    setNowPlaying(np);
    setRecentlyPlayed(recent);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const pollNowPlaying = setInterval(async () => {
      const np = await fetchSpotify<NowPlaying>('now-playing');
      if (np) setNowPlaying(np);
    }, 5000);

    const pollRecent = setInterval(async () => {
      const recent = await fetchSpotify<RecentlyPlayed>('recently-played');
      if (recent) setRecentlyPlayed(recent);
    }, 30000);

    return () => {
      clearInterval(pollNowPlaying);
      clearInterval(pollRecent);
    };
  }, []);

  if (notConfigured) {
    return (
      <div className="h-full bg-[#0a0a0a] p-2">
        <Placeholder />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0a0a0a]">
        <Disc3 size={32} className="animate-spin text-[#1DB954]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 bg-[#0a0a0a] p-2">
      {/* Scrollable content panel */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-[#121212]">
        {/* Profile header */}
        {profile && (
          <div
            className="px-8 pb-8 pt-10"
            style={{
              background:
                'linear-gradient(180deg, #1a3a2a 0%, #121212 100%)',
            }}
          >
            <div className="flex items-center gap-6">
              {profile.images[0] ? (
                <img
                  src={profile.images[0].url}
                  alt=""
                  className="h-36 w-36 shrink-0 rounded-full object-cover shadow-2xl shadow-black/60"
                />
              ) : (
                <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-[#282828] shadow-2xl shadow-black/60">
                  <Music size={48} className="text-[#b3b3b3]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Profile
                </p>
                <h1 className="mt-1 truncate text-4xl font-black tracking-tight text-white">
                  {profile.display_name}
                </h1>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-sm text-[#b3b3b3]">
                    {profile.followers.total.toLocaleString()} followers
                  </span>
                  <span className="text-[#b3b3b3]">&middot;</span>
                  <a
                    href={profile.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#1DB954] transition-colors hover:text-[#1ed760]"
                  >
                    Open in Spotify <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Played section */}
        <div className="px-8 pb-8">
          <div className="flex items-center gap-2.5 pb-4 pt-2">
            <History size={18} className="text-[#b3b3b3]" />
            <h2 className="text-lg font-bold text-white">
              Recently Played
            </h2>
          </div>

          <div className="mb-1 flex items-center gap-3 border-b border-white/[0.06] px-3 py-2 text-[11px] uppercase tracking-wider text-[#b3b3b3]">
            <span className="w-5 text-right">#</span>
            <span className="w-10" />
            <span className="flex-1">Title</span>
            <span className="hidden sm:block">Album</span>
            <span className="ml-4 flex items-center">
              <Clock size={12} />
            </span>
          </div>

          <div className="space-y-0.5">
            {recentlyPlayed?.items.map((item, i) => (
              <TrackRow
                key={`${item.track.id}-${item.played_at}`}
                track={item.track}
                index={i}
                playedAt={item.played_at}
              />
            ))}
          </div>
          {!recentlyPlayed?.items.length && (
            <p className="py-12 text-center text-sm text-[#b3b3b3]">
              No recently played tracks
            </p>
          )}
        </div>
      </div>

      {/* Now Playing bar panel */}
      <NowPlayingBar data={nowPlaying} progress={progress} />
    </div>
  );
}
