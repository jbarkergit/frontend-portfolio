import { iso } from 'app/base/iso/iso';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type SpotifyRequest = {
  method: Method;
  endpoint: string;
  body?: Record<string, unknown>;
};

type PathParams = {
  id: string;
  ids: number[];
  category_id: string;
  genres: string[];
  market: keyof typeof iso;
  markets: (keyof typeof iso)[];
  locale: string;
  limit: number;
  offset: number;
  additional_types: string;
  device_id: string;
  device_ids: string[];
  play: boolean;
  position_ms: number;
  state: 'track' | 'context' | 'off';
  volume_percent: number;
  after: number;
  before: number;
  uri: string;
  playlist_id: string;
  fields: string;
  uris: string[];
  position: number;
  user_id: string;
  q: 'album' | 'artist' | 'track' | 'year' | 'upc' | 'tag:hipster' | 'tag:new' | 'isrc' | 'genre';
  type: string[];
  include_external: 'audio';
  seed_artists: string[];
  seed_genres: string[];
  seed_tracks: string[];
  min_acousticness: number;
  max_acousticness: number;
  target_acousticness: number;
  min_danceability: number;
  max_danceability: number;
  target_danceability: number;
  min_duration_ms: number;
  max_duration_ms: number;
  target_duration_ms: number;
  min_energy: number;
  max_energy: number;
  target_energy: number;
  min_instrumentalness: number;
  max_instrumentalness: number;
  target_instrumentalness: number;
  min_key: number;
  max_key: number;
  target_key: number;
  min_liveness: number;
  max_liveness: number;
  target_liveness: number;
  min_loudness: number;
  max_loudness: number;
  target_loudness: number;
  min_mode: number;
  max_mode: number;
  target_mode: number;
  min_popularity: number;
  max_popularity: number;
  target_popularity: number;
  min_speechiness: number;
  max_speechiness: number;
  target_speechiness: number;
  min_tempo: number;
  max_tempo: number;
  target_tempo: number;
  min_time_signature: number;
  max_time_signature: number;
  target_time_signature: number;
  min_valence: number;
  max_valence: number;
  target_valence: number;
  time_range: string;
  include_groups: string[];
};

type SpotifyBodyParams = {
  ids: string[];
  name: string;
  public: boolean;
  collaborative: boolean;
  description: string;
  uris: string[];
  range_start: number;
  insert_before: number;
  range_length: number;
  snapshot_id: string;
  position: number;
  tracks: Record<string, unknown>[];
  uri: string;
  timestamped_ids: { id: string; added_at: string }[];
};

function buildEndpoint(endpoint: string, pathParams?: Record<string, unknown>): string {
  if (!pathParams) return endpoint;

  const queries: string[] = [];

  // Replace templates with encoded values and track queries
  for (const [key, value] of Object.entries(pathParams)) {
    const template = `{${key}}`;

    if (endpoint.includes(template)) {
      endpoint = endpoint.replace(template, encodeURIComponent(String(value)));
    } else {
      const normalizedValue = key === 'market' ? iso[value as keyof typeof iso] : value;
      queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(normalizedValue))}`);
    }
  }

  // Merge endpoint and queries
  if (queries.length) {
    endpoint += `?${queries.join('&')}`;
  }

  return endpoint;
}

const endpoints = {
  // https://developer.spotify.com/documentation/web-api
  albums: {
    getAlbum: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/albums/{id}`, pathParams),
    }),
    getSeveralAlbums: (pathParams: Pick<PathParams, 'ids' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/albums`, pathParams),
    }),
    getAlbumTracks: (pathParams: Pick<PathParams, 'id' | 'market' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/albums/{id}/tracks`, pathParams),
    }),
    getUsersSavedAlbums: (pathParams: Pick<PathParams, 'limit' | 'offset' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/albums`, pathParams),
    }),
    saveAlbumsForCurrentUser: (pathParams = undefined, body: Pick<SpotifyBodyParams, 'ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/albums`, pathParams),
      body,
    }),
    removeUsersSavedAlbums: (pathParams: undefined, body: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/albums`, pathParams),
      body,
    }),
    checkUsersSavedAlbums: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/albums/contains`, pathParams),
    }),
    getNewReleases: (pathParams: Pick<PathParams, 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/browse/new-releases`, pathParams),
    }),
  },
  artists: {
    getArtist: (pathParams: Pick<PathParams, 'id'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/artists/{id}`, pathParams),
    }),
    getSeveralArtists: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/artists`, pathParams),
    }),
    getArtistsAlbums: (
      pathParams: Pick<PathParams, 'id' | 'include_groups' | 'market' | 'limit' | 'offset'>
    ): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/artists/{id}/albums`, pathParams),
    }),
    getArtistsTopTracks: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/artists/{id}/top-tracks`, pathParams),
    }),
    // getArtistsRelatedTracks
  },
  audiobooks: {
    getAnAudiobook: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/audiobooks/{id}`, pathParams),
    }),
    getSeveralAudiobooks: (pathParams: Pick<PathParams, 'ids' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/audiobooks`, pathParams),
    }),
    getAudiobookChapters: (pathParams: Pick<PathParams, 'id' | 'market' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/audiobooks/{id}/chapters`, pathParams),
    }),
    getUsersSavedAudiobooks: (pathParams: Pick<PathParams, 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/audiobooks`, pathParams),
    }),
    saveAudiobooksForCurrentUser: (body: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/audiobooks`, undefined),
      body,
    }),
    removeUsersSavedAudiobooks: (body: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/audiobooks`, undefined),
      body,
    }),
    checkUsersSavedAudiobooks: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/audiobooks/contains`, pathParams),
    }),
  },
  categories: {
    getSeveralBrowseCategories: (pathParams: Pick<PathParams, 'locale' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/browse/categories`, pathParams),
    }),
    getSingleBrowseCategory: (pathParams: Pick<PathParams, 'category_id' | 'locale'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/browse/categories/{category_id}`, pathParams),
    }),
  },
  chapters: {
    getAChapter: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/chapters/{id}`, pathParams),
    }),
    getSeveralChapters: (pathParams: Pick<PathParams, 'ids' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/chapters`, pathParams),
    }),
  },
  episodes: {
    getEpisode: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/episodes/{id}`, pathParams),
    }),
    getSeveralEpisodes: (pathParams: Pick<PathParams, 'ids' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/episodes`, pathParams),
    }),
    getUsersSavedEpisodes: (pathParams: Pick<PathParams, 'market' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/episodes`, pathParams),
    }),
    saveEpisodesForCurrentUser: (body: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/episodes`, undefined),
      body,
    }),
    removeUsersSavedEpisodes: (body: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/episodes`, undefined),
      body,
    }),
    checkUsersSavedEpisodes: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/episodes/contains`, pathParams),
    }),
  },
  //   genres: {
  //     getAvailableGenreSeeds
  //   },
  markets: {
    getAvailableMarkets: (): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/markets`, undefined),
    }),
  },
  player: {
    getPlaybackState: (pathParams: Pick<PathParams, 'market' | 'additional_types'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player`, pathParams),
    }),
    transferPlayback: (body: Pick<PathParams, 'device_ids' | 'play'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player`, undefined),
      body,
    }),
    getAvailableDevices: (): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/devices`, undefined),
    }),
    getCurrentlyPlayingTrack: (pathParams: Pick<PathParams, 'market' | 'additional_types'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/currently-playing`, pathParams),
    }),
    startOrResumePlayback: (body: Pick<PathParams, 'device_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/play`, undefined),
      body,
    }),
    pausePlayback: (body: Pick<PathParams, 'device_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/pause`, undefined),
      body,
    }),
    skipToNext: (body: Pick<PathParams, 'device_id'>): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/next`, undefined),
      body,
    }),
    skipToPrevious: (body: Pick<PathParams, 'device_id'>): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/previous`, undefined),
      body,
    }),
    seekToPosition: (body: Pick<PathParams, 'position_ms' | 'device_id'>): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/seek`, undefined),
      body,
    }),
    setRepeatMode: (body: Pick<PathParams, 'state' | 'device_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/repeat`, undefined),
      body,
    }),
    setPlaybackVolume: (body: Pick<PathParams, 'volume_percent' | 'device_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/volume`, undefined),
      body,
    }),
    togglePlaybackShuffle: (body: Pick<PathParams, 'state' | 'device_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/shuffle`, undefined),
      body,
    }),
    getRecentlyPlayedTracks: (pathParams: Pick<PathParams, 'limit' | 'after' | 'before'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/recently-played`, pathParams),
    }),
    getTheUsersQueue: (): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/queue`, undefined),
    }),
    addItemsToPlaybackQueue: (body: Pick<PathParams, 'uri' | 'device_id'>): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/player/queue`, undefined),
      body,
    }),
  },
  playlists: {
    getPlaylist: (
      pathParams: Pick<PathParams, 'playlist_id' | 'market' | 'fields' | 'additional_types'>
    ): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}`, pathParams),
    }),
    changePlaylistDetails: (
      pathParams: Pick<PathParams, 'playlist_id'>,
      body: Pick<SpotifyBodyParams, 'name' | 'public' | 'collaborative' | 'description'>
    ): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}`, pathParams),
      body,
    }),
    getPlaylistItems: (
      pathParams: Pick<PathParams, 'playlist_id' | 'market' | 'fields' | 'limit' | 'offset' | 'additional_types'>
    ): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/tracks`, pathParams),
    }),
    updatePlaylistItems: (
      pathParams: Pick<PathParams, 'playlist_id' | 'uris'>,
      body: Pick<SpotifyBodyParams, 'uris' | 'range_start' | 'insert_before' | 'range_length' | 'snapshot_id'>
    ): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/tracks`, pathParams),
      body,
    }),
    addItemsToPlaylist: (
      pathParams: Pick<PathParams, 'playlist_id'>,
      body: Pick<SpotifyBodyParams, 'position' | 'uris'>
    ): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/tracks`, pathParams),
      body,
    }),
    removePlaylistItems: (
      pathParams: Pick<PathParams, 'playlist_id'>,
      body: Pick<SpotifyBodyParams, 'tracks' | 'uri' | 'snapshot_id'>
    ): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/tracks`, pathParams),
      body,
    }),
    getCurrentUsersPlaylists: (pathParams: Pick<PathParams, 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/playlists`, pathParams),
    }),
    getUsersPlaylists: (pathParams: Pick<PathParams, 'user_id' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/users/{user_id}/playlists`, pathParams),
    }),
    createPlaylist: (
      pathParams: Pick<PathParams, 'user_id'>,
      body: Pick<SpotifyBodyParams, 'name' | 'public' | 'collaborative' | 'description'>
    ): SpotifyRequest => ({
      method: 'POST',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/users/{user_id}/playlists`, pathParams),
      body,
    }),
    // getFeaturedPlaylists
    // getCategorysPlaylists
    getPlaylistCoverImage: (pathParams: Pick<PathParams, 'playlist_id'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/images`, pathParams),
    }),
    addCustomPlaylistCoverImage: (pathParams: Pick<PathParams, 'playlist_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/images`, pathParams),
    }),
  },
  search: {
    searchForItem: (
      pathParams: Pick<PathParams, 'q' | 'type' | 'market' | 'limit' | 'offset' | 'include_external'>
    ): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/search`, pathParams),
    }),
  },
  shows: {
    getShow: (pathParams: Pick<PathParams, 'market' | 'id'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/shows/{id}`, pathParams),
    }),
    getSeveralShows: (pathParams: Pick<PathParams, 'market' | 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/shows`, pathParams),
    }),
    getShowEpisodes: (pathParams: Pick<PathParams, 'id' | 'market' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/shows/{id}/episodes`, pathParams),
    }),
    getUsersSavedShows: (pathParams: Pick<PathParams, 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/shows`, pathParams),
    }),
    saveShowsForCurrentUser: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/shows`, pathParams),
    }),
    removeUsersSavedShows: (pathParams: Pick<PathParams, 'ids' | 'market'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/shows`, pathParams),
    }),
    checkUsersSavedShows: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/shows/contains`, pathParams),
    }),
  },
  tracks: {
    getTrack: (pathParams: Pick<PathParams, 'id' | 'market'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/tracks/{id}`, pathParams),
    }),
    getSeveralTracks: (pathParams: Pick<PathParams, 'market' | 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/tracks`, pathParams),
    }),
    getUsersSavedTracks: (pathParams: Pick<PathParams, 'market' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/tracks`, pathParams),
    }),
    saveTracksForCurrentUser: (body: Pick<SpotifyBodyParams, 'ids' | 'timestamped_ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/tracks`, undefined),
      body,
    }),
    removeUsersSavedTracks: (body: Pick<SpotifyBodyParams, 'ids'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/tracks`, undefined),
      body,
    }),
    checkUsersSavedTracks: (pathParams: Pick<PathParams, 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/tracks/contains`, pathParams),
    }),
    // getSeveralTracksAudioFeatures
    // getTracksAudioFeatures
    // getTracksAudioAnalysis
    // getRecommendations
  },
  users: {
    getCurrentUsersProfile: (): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me`, undefined),
    }),
    getUsersTopItems: (pathParams: Pick<PathParams, 'type' | 'time_range' | 'limit' | 'offset'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/top/{type}`, pathParams),
    }),
    getUsersProfile: (pathParams: Pick<PathParams, 'user_id'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/users/{user_id}`, pathParams),
    }),
    followPlaylist: (pathParams: Pick<PathParams, 'playlist_id'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/followers`, pathParams),
    }),
    unfollowPlaylist: (pathParams: Pick<PathParams, 'playlist_id'>): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/followers`, pathParams),
    }),
    getFollowedArtists: (pathParams: Pick<PathParams, 'type' | 'after' | 'limit'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/following`, pathParams),
    }),
    followArtistsOrUsers: (pathParams: Pick<PathParams, 'type' | 'ids'>): SpotifyRequest => ({
      method: 'PUT',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/following`, pathParams),
    }),
    unfollowArtistsOrUsers: (
      pathParams: Pick<PathParams, 'type' | 'ids'>,
      body: Pick<SpotifyBodyParams, 'ids'>
    ): SpotifyRequest => ({
      method: 'DELETE',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/following`, pathParams),
      body,
    }),
    checkIfUserFollowsArtistsOrUsers: (pathParams: Pick<PathParams, 'type' | 'ids'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/me/following/contains`, pathParams),
    }),
    checkIfCurrentUserFollowsPlaylist: (pathParams: Pick<PathParams, 'playlist_id'>): SpotifyRequest => ({
      method: 'GET',
      endpoint: buildEndpoint(`https://api.spotify.com/v1/playlists/{playlist_id}/followers/contains`, pathParams),
    }),
  },
} as const;

export const spotifyEndpoints = {
  ...endpoints.albums,
  ...endpoints.artists,
  ...endpoints.audiobooks,
  ...endpoints.categories,
  ...endpoints.chapters,
  ...endpoints.episodes,
  ...endpoints.markets,
  ...endpoints.player,
  ...endpoints.playlists,
  ...endpoints.search,
  ...endpoints.shows,
  ...endpoints.tracks,
  ...endpoints.users,
} as const;
