import { tmdbDiscoveryIds } from 'app/film-database/composables/const/tmdbDiscoveryIds';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import englishBadWordsRaw from 'naughty-words/en.json';

// Endpoints
const BASE_URL = 'https://api.themoviedb.org/3/';
const QUERY_PARAMS = 'language=en-US&page=1&region=US';
const ADULT_PARAMS = '&include_adult=false';

const tmdbEndpoints = {
  never: {
    now_playing: () => `${BASE_URL}movie/now_playing?${QUERY_PARAMS}${ADULT_PARAMS}`,
    popular: () => `${BASE_URL}movie/popular?${QUERY_PARAMS}${ADULT_PARAMS}`,
    top_rated: () => `${BASE_URL}movie/top_rated?${QUERY_PARAMS}${ADULT_PARAMS}`,
    trending_this_week: () => `${BASE_URL}trending/movie/week?${QUERY_PARAMS}${ADULT_PARAMS}`,
    trending_today: () => `${BASE_URL}trending/movie/day?${QUERY_PARAMS}${ADULT_PARAMS}`,
    upcoming: () => `${BASE_URL}movie/upcoming?${QUERY_PARAMS}${ADULT_PARAMS}`,
  },
  number: {
    credits: (movie_id: number) => `${BASE_URL}movie/${movie_id}/credits`,
    details: (movie_id: number) => `${BASE_URL}movie/${movie_id}${ADULT_PARAMS}`,
    recommendations: (movie_id: number) => `${BASE_URL}movie/${movie_id}/recommendations${ADULT_PARAMS}`,
    reviews: (movie_id: number) => `${BASE_URL}movie/${movie_id}/reviews`,
    videos: (movie_id: number) => `${BASE_URL}movie/${movie_id}/videos`,
    watchProviders: (movie_id: number) => `${BASE_URL}movie/${movie_id}/watch/providers`,
    discover: (genre_id: number) => `${BASE_URL}discover/movie?with_genres=${genre_id}${ADULT_PARAMS}`,
    personDetails: (person_id: number) => `${BASE_URL}person/${person_id}`,
    personCredits: (person_id: number) => `${BASE_URL}person/${person_id}/combined_credits`,
  },
  string: {
    search: (search_term: string) =>
      `${BASE_URL}search/movie?query=${encodeURIComponent(search_term)}&${QUERY_PARAMS}${ADULT_PARAMS}`,
  },
} as const;

// Group keys by nest properties 'never', 'number', 'string' to isolate argument shape
type TmdbNeverKeys = keyof typeof tmdbEndpoints.never;
type TmdbNumberKeys = keyof typeof tmdbEndpoints.number;
type TmdbStringKeys = keyof typeof tmdbEndpoints.string;

// Isolate argument shapes
type ArgumentShapes<K> = K extends TmdbNeverKeys
  ? K // Literal
  : K extends TmdbNumberKeys
    ? K extends 'discover'
      ? { [P in K]: keyof typeof tmdbDiscoveryIds }
      : { [P in K]: number } // All Number endpoints mapped to { key: number }
    : K extends TmdbStringKeys
      ? { [P in K]: string } // All String endpoints apped to { key: string }
      : undefined;

// Unionize as arguments
type Argument = { [K in keyof TmdbResponseFlat]: ArgumentShapes<K> }[keyof TmdbResponseFlat];

// Identify key from argument
type ArgumentToKey<T> = T extends keyof TmdbResponseFlat
  ? T
  : // biome-ignore lint/suspicious/noExplicitAny: <generic>
    T extends { [K in keyof TmdbResponseFlat]?: any }
    ? Extract<keyof T, keyof TmdbResponseFlat>
    : never;

// Shape response
// biome-ignore lint/suspicious/noExplicitAny: <generic>
type CallResponse<T> = T extends any[] // If T is an array of arguments
  ? {
      [K in keyof T]: T[K] extends Argument
        ? { key: ArgumentToKey<T[K]>; response: TmdbResponseFlat[ArgumentToKey<T[K]>] }
        : never;
    }
  : { key: ArgumentToKey<T>; response: TmdbResponseFlat[ArgumentToKey<T>] };

// Array of keys we do not want to cache
const excludedCacheKeys = [
  'videos',
  'personDetails',
  'personCredits',
  'credits',
  'watchProviders',
  'search',
  'discover',
] as const;

// Array of keys we do not want to filter
const excludedFilterKeys = [
  'credits',
  'details',
  'reviews',
  'watchProviders',
  'personDetails',
  'personCredits',
] as const;

async function callApi(
  controller: AbortController,
  keyEndpoint: {
    key: keyof TmdbResponseFlat | keyof typeof tmdbDiscoveryIds;
    endpoint: string;
  }
): Promise<unknown | undefined> {
  // Destructure
  const { key, endpoint } = keyEndpoint;

  // Fetch
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env['VITE_TMDB_READ_ACCESS_TOKEN']}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Aborted request for ${key}`);
    }

    const result = await response.json();

    // Cache keys not found in excludedCacheKeys array
    if (!excludedCacheKeys.includes(key)) {
      sessionStorage.setItem(key, JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error('Key:', key, error);
    return undefined;
  }
}

async function processArgument(controller: AbortController, arg: Argument): Promise<unknown> {
  // Assignment
  let key: keyof TmdbResponseFlat | keyof typeof tmdbDiscoveryIds | undefined;
  let endpoint: string | undefined;

  if (typeof arg === 'string') {
    key = arg;
    endpoint = tmdbEndpoints.never[key]?.();
  } else if (typeof arg === 'object') {
    const [argKey, query] = Object.entries(arg)[0] as [TmdbNumberKeys, number] | [TmdbStringKeys, string];
    const isDiscoverQuery: boolean = Object.keys(tmdbDiscoveryIds).includes(query as string);

    if (isDiscoverQuery) {
      key = query as keyof typeof tmdbDiscoveryIds;
      endpoint = tmdbEndpoints.number.discover(tmdbDiscoveryIds[key]);
    } else {
      key = argKey;
      if (argKey in tmdbEndpoints.number) {
        endpoint = tmdbEndpoints.number[argKey as TmdbNumberKeys](query as number);
      } else if (argKey in tmdbEndpoints.string) {
        endpoint = tmdbEndpoints.string[argKey as TmdbStringKeys](query as string);
      } else {
        return undefined;
      }
    }
  }

  if (!key || !endpoint) return undefined;

  // Identify if the request is cached
  const item = sessionStorage.getItem(key);
  // If cached, return cached, else await fetch
  const data = { key: key, response: item ? JSON.parse(item) : await callApi(controller, { key, endpoint }) };
  // If data is undefined, short circuit instead of returning undefined
  if (!data.response) return;
  // Return cached item or fetch response
  return data;
}

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled' && result.value !== undefined;
}

/**
 * TMDB Api 'adult' query partially filters adult content but some results may leak adult content due to incorrect internal flags.
 * Some options to combat this are a third party moderation service, some combination of region locking, filtering by rating and keyword filtering.
 * We've leveraging keyword filtering with npm pkg naughty-words as a solution.
 */

// biome-ignore lint/suspicious/noExplicitAny: <types are generic and we're handling objects appropriately>
function isNotNaughty(item: any): boolean {
  if (item && typeof item === 'object' && 'title' in item && 'overview' in item && 'adult' in item) {
    const title = (item.title as string)?.trim().toLowerCase() ?? '';
    const overview = (item.overview as string)?.toLowerCase() ?? '';
    return !item.adult && !englishBadWordsRaw.some((word) => title.includes(word) || overview.includes(word));
  }
  return true;
}

type FilterContentParam<T> = {
  key: ArgumentToKey<T>;
  response: TmdbResponseFlat[ArgumentToKey<T>];
};

function filterContent<T>(result: CallResponse<T>): FilterContentParam<T> | FilterContentParam<T>[] {
  if (Array.isArray(result)) {
    return result.map(({ key, response }) => ({
      key,
      response:
        'results' in response && Array.isArray(response.results) && !excludedFilterKeys.includes(key)
          ? { ...response, results: response.results.filter(isNotNaughty) }
          : response,
    }));
  } else {
    return {
      key: result.key,
      response:
        'results' in result.response &&
        Array.isArray(result.response.results) &&
        !excludedFilterKeys.includes(result.key)
          ? { ...result.response, results: result.response.results.filter(isNotNaughty) }
          : result.response,
    };
  }
}

export async function tmdbCall<T extends Argument | Argument[]>(
  controller: AbortController,
  args: T
): Promise<CallResponse<T>> {
  // Simplify argument mapping
  const parameters = Array.isArray(args) ? args : [args];

  // Map arguments into a callback returning an object array for hand-off to Promise.allSettled
  const promises = (parameters as Argument[]).map(async (param) => await processArgument(controller, param));

  // Await allSettled
  const responses = await Promise.allSettled(promises);

  // Filter out rejected and undefined while narrowing type from PromiseSettledResult to PromiseFulfilledResult then create a new array of values
  const fulfilled = responses.filter(isFulfilled).map((f) => f.value) as CallResponse<T>[];

  // Prevent empty arrays from proceeding
  if (fulfilled.length === 0) {
    throw new Error('The requested TMDB API call failed to return a response.');
  }

  // If argument is an array, return, else if argument is a single string or object, return the data at index 0
  const result = (Array.isArray(args) ? fulfilled : fulfilled[0]) as CallResponse<T>;

  // Filter content
  const filteredResult = filterContent(result);

  // Test logs
  // console.log('Parameters:', parameters);
  // console.log('Responses:', responses);
  // console.log('Fulfilled:', fulfilled);
  // console.log('Result:', result);
  // console.log('Filtered Result:', filteredResult);
  // console.log(' -------------------------- ');

  // Return filtered and type narrowed fulfilled responses
  return filteredResult as CallResponse<T>;
}
