import { onRequestGet as __api_spotify_ts_onRequestGet } from "/home/lotus/PersonalProjects/personalPortafolio/functions/api/spotify.ts"
import { onRequestOptions as __api_spotify_ts_onRequestOptions } from "/home/lotus/PersonalProjects/personalPortafolio/functions/api/spotify.ts"

export const routes = [
    {
      routePath: "/api/spotify",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_spotify_ts_onRequestGet],
    },
  {
      routePath: "/api/spotify",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_spotify_ts_onRequestOptions],
    },
  ]