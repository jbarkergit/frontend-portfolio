import { type SpotifyRequest, spotifyEndpoints } from '~/spotify-visualizer/composables/const/spotifyEndpoints';
import type { SpotifyEndpointKeys, SpotifyResponseFor } from '~/spotify-visualizer/composables/types/SpotifyResponse';

export async function callSpotify<K extends SpotifyEndpointKeys>(
  request: K,
  ...args: Parameters<(typeof spotifyEndpoints)[K]>
): Promise<SpotifyResponseFor<K>> {
  const endpointFn = spotifyEndpoints[request] as (...args: Parameters<(typeof spotifyEndpoints)[K]>) => SpotifyRequest;
  const endpointRequest = endpointFn(...args);

  const res = await fetch(endpointRequest.endpoint, {
    method: endpointRequest.method,
    body: endpointRequest.body ? JSON.stringify(endpointRequest.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return res.json() as SpotifyResponseFor<K>;
}
