# Angelo's Windows 12 Portfolio

Interactive personal portfolio styled as a Windows 12 desktop simulation.

## Links

- **Repo:** https://github.com/WhiteRabbitCoder/personalPortafolio
- **Live:** https://angelo-portfolio.pages.dev
- **Hosting:** Cloudflare Pages (project name: `angelo-portfolio`)

## Stack

- **Vite** — Bundler/dev server
- **React 19** — UI framework
- **TypeScript 6** — Type safety
- **Zustand** — State management (3 stores: system, window, desktop)
- **Tailwind CSS v4** — Styling via `@tailwindcss/vite` plugin
- **Framer Motion 12** — Animations (boot sequence, windows, menus)
- **Lucide React** — Icon system

No heavy window management libraries — drag and resize are custom hooks (`useDrag`, `useResize`).

## Project Structure

```
src/
├── apps/                    # Each "app" in the OS
│   ├── about/               # Notepad — About Me / bio
│   ├── projects/            # File Explorer — project showcase
│   ├── terminal/            # Interactive terminal (10 commands)
│   └── spotify/             # Spotify profile + now playing (real API)
├── components/
│   ├── boot/                # BootScreen (loading), LockScreen
│   ├── desktop/             # Desktop, DesktopIcon
│   ├── taskbar/             # Taskbar (floating), StartMenu
│   └── window/              # Window (drag/resize/maximize), AppIcon
├── stores/
│   ├── systemStore.ts       # Boot phase, clock
│   ├── windowStore.ts       # Open windows, positions, z-index
│   └── desktopStore.ts      # Desktop icons, start menu state
├── hooks/
│   ├── useDrag.ts           # Pointer-based drag
│   └── useResize.ts         # 8-edge resize handles
├── data/
│   ├── projects.ts          # Project entries (from GitHub repos)
│   └── about.ts             # Bio text
├── types/index.ts           # Shared types (AppId, WindowState, etc.)
├── index.css                # Tailwind imports + glassmorphism utilities
├── App.tsx                  # Root — boot phase router
└── main.tsx                 # Entry point

functions/
└── api/
    └── spotify.ts           # Cloudflare Pages Function — Spotify API proxy

scripts/
└── get-spotify-token.mjs    # Helper to obtain Spotify refresh token
```

## Key Patterns

- **Boot sequence:** `loading` → `lock` → `desktop` (controlled by `systemStore.bootPhase`)
- **Window lifecycle:** `openWindow(appId)` → renders `<Window>` → drag/resize/focus/minimize/maximize/close
- **Glassmorphism:** `.glass` and `.glass-heavy` utility classes in `index.css`. Max 2-3 blur layers visible at once for performance. `contain: layout paint` on windows. Fallback for `prefers-reduced-motion`.
- **Taskbar click logic:** Click pinned app → if not open, open it. If open and focused, minimize. If open but not focused, focus it.
- **Adding a new app:** Create component in `src/apps/<name>/`, add to `AppId` union in types, add defaults in `windowStore.ts` `APP_DEFAULTS`, add case in `Desktop.tsx` `renderApp()`, add icon in `desktopStore.ts` and `taskbar/Taskbar.tsx`.

## Commands

```bash
npm run dev        # Vite dev server at localhost:5173 (no Cloudflare Functions)
npm run dev:full   # Wrangler + Vite — includes Cloudflare Functions (needs .dev.vars)
npm run build      # Type-check + production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run deploy     # Build + deploy to Cloudflare Pages (production)
npm run spotify:token  # Helper to get Spotify refresh token
```

## Path Alias

`@/*` maps to `src/*` — configured in both `tsconfig.app.json` (paths) and `vite.config.ts` (resolve.alias).

## Design Tokens

Defined as CSS custom properties in `src/index.css` under `@theme`:

- `--color-glass-bg` / `--color-glass-border` — window/panel backgrounds
- `--color-accent` (`#8b5cf6`) — violet accent throughout
- `--color-surface` — heavy glass background
- `--color-taskbar` / `--color-startmenu` — specific component backgrounds
- `--color-text-primary` / `--color-text-secondary` / `--color-text-muted`

## Spotify Integration

The Spotify app uses a Cloudflare Pages Function (`functions/api/spotify.ts`) as a server-side proxy to keep credentials secret. The frontend never sees the client_secret or refresh_token.

**Setup:**
1. Create app at https://developer.spotify.com/dashboard
2. Add `http://localhost:8888/callback` as Redirect URI
3. Run `npm run spotify:token` and follow the browser flow
4. Add the 3 env vars to Cloudflare Pages dashboard (Settings > Environment variables):
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
5. For local dev, put them in `.dev.vars` and use `npm run dev:full`

**API endpoints** (all via the single function at `/api/spotify?type=`):
- `now-playing` — currently playing track (30s cache)
- `profile` — user profile (1h cache)
- `top-tracks` — top 10 tracks short term (5m cache)
- `top-artists` — top 6 artists short term (5m cache)
- `recently-played` — last 10 played tracks (1m cache)

If credentials aren't set, the app shows a placeholder with setup instructions.

## Roadmap

### Phase 2 (Polish)
- Right-click context menu on desktop
- Settings app (wallpaper picker, light/dark theme)
- Snap layouts (drag window to screen edge)
- Refined animations and transitions
- Better mobile responsive (app drawer, stack navigation)

### Phase 3 (Details)
- System notifications
- Widget panel (Windows 12 style)
- Easter eggs
- Project screenshots/GIFs in explorer detail panel
