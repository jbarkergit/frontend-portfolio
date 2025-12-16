// Utility
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  const codeVerifier = values.reduce((acc, x) => acc + possible[x % possible.length], '');
  localStorage.setItem('code_verifier', codeVerifier);
  return codeVerifier;
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(plain));
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Constants
const clientId = import.meta.env['VITE_SPOTIFY_CLIENT_ID'] as string;
const redirectUri = 'http://127.0.0.1:5173/spotify-visualizer';

// Auth Flow
async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const authUrl = new URL('https://accounts.spotify.com/authorize');

  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    // https://developer.spotify.com/documentation/web-api/concepts/scopes
    scope:
      'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-private',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }).toString();

  window.location.href = authUrl.toString();
}

async function fetchToken(body: Record<string, string>) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });

  if (!res.ok) throw new Error('Failed to fetch token');

  // biome-ignore lint/suspicious/noExplicitAny: <we aren't defining data at this point>
  const data = (await res.json()) as any;

  if (data.access_token) localStorage.setItem('access_token', data.access_token);
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
  if (data.expires_in) {
    const expiresAt = Date.now() + data.expires_in * 1000;
    localStorage.setItem('access_token_expires_at', expiresAt.toString());
  }

  return data;
}

// Exchange code for token
async function handleSpotifyToken() {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return null;

  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) throw new Error('Missing code_verifier');

  return fetchToken({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
}

// Refresh access token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token found');

  return fetchToken({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
}

// Acess token expiry check
export function isAccessTokenExpired() {
  const expiresAt = localStorage.getItem('access_token_expires_at');
  if (!expiresAt) return true;
  return Date.now() >= parseInt(expiresAt);
}

// Initialize
export async function initSpotifyAuth() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const accessToken = localStorage.getItem('access_token');

  // If a code exists in the url, exchange it and cleanup the URL to prevent reuse
  if (code) {
    await handleSpotifyToken();
    window.history.replaceState({}, document.title, redirectUri);
    return;
  }

  // If there is no access token, redirect to Spotify auth
  if (!accessToken || accessToken.trim() === '') {
    await redirectToSpotifyAuth();
    return;
  }

  // Refresh token if expired
  if (isAccessTokenExpired() && localStorage.getItem('refresh_token')) {
    await refreshAccessToken();
  }
}

// Auto-refresh access token
setInterval(
  async () => {
    if (isAccessTokenExpired() && localStorage.getItem('refresh_token')) {
      await refreshAccessToken();
    }
  },
  55 * 60 * 1000
);
