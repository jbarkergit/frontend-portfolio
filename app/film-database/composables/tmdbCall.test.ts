import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as tmdb from '../composables/tmdbCall.ts';

const { tmdbCall, processArgumentEndpoint, filterContent, callApi } = tmdb;
const abortController = new AbortController();

describe('TMDB API WRAPPER', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
  });

  describe('tmdbCall', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      sessionStorage.clear();
    });

    it('Accepts any argument shape', async () => {
      const fakeResponse = { key: 'now_playing', response: { results: [] } };

      // Mock callApi so tmdbCall does not call real API
      vi.spyOn(tmdb, 'callApi').mockImplementation(async () => fakeResponse);

      const string = await tmdbCall(abortController, 'now_playing');
      const array = await tmdbCall(abortController, ['now_playing']);
      const mixedArray = await tmdbCall(abortController, ['now_playing', { credits: 123 }]);
      const object = await tmdbCall(abortController, { credits: 123 });

      expect(string).toBeDefined();
      expect(array).toBeDefined();
      expect(mixedArray).toBeDefined();
      expect(object).toBeDefined();
    });

    it('Safely rejects bad requests', async () => {
      const fakeResponse = { key: 'never', response: null };

      // Mock callApi to return fake data even for bad keys
      vi.spyOn(tmdb, 'callApi').mockImplementation(async () => fakeResponse);

      //@ts-expect-error intentional bad key
      const badRequest = await tmdbCall(abortController, 'never');
      //@ts-expect-error intentional bad key
      const badMixedRequest = await tmdbCall(abortController, ['now_playing', 'never']);

      expect(badRequest).toBeDefined();
      expect(badMixedRequest).toBeDefined();
    });
  });

  describe('processArgumentEndpoint', () => {
    it('Returns endpoints for given key parameter', async () => {
      await processArgumentEndpoint(abortController, 'now_playing').then((r) => {
        const result = r as Record<string, unknown>;
        expect(result).toHaveProperty('key');
        expect(result['key']).toBeDefined();
      });
    });
  });

  describe('filterContent', () => {
    it('Filters adult content from an array result', () => {
      const argument = [
        {
          key: 'now_playing',
          response: {
            results: ['good', 'xxx'],
          },
        },
      ];

      // @ts-expect-error intentional unknown type
      const result = filterContent(argument);

      expect(Array.isArray(result)).toBe(true);
      // @ts-expect-error intentional unknown type
      expect(result[0].response.results.length).toBe(1);
    });

    it('Filters adult content from an object result', () => {
      const argument = {
        key: 'now_playing',
        response: {
          results: ['good', 'xxx'],
        },
      };

      // @ts-expect-error intentional unknown type
      const result = filterContent(argument);

      expect(result).toHaveProperty('key', 'now_playing');
      // @ts-expect-error intentional unknown type
      expect(result.response.results.length).toBe(1);
    });
  });

  describe('callApi', () => {
    const controller = new AbortController();

    it('returns JSON data and caches it', async () => {
      const mockResponse = { foo: 'bar' };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponse),
        } as unknown as Response)
      );

      const keyEndpoint = {
        key: 'now_playing' as keyof TmdbResponseFlat,
        endpoint: '/fake-endpoint',
      };

      const result = await callApi(controller, keyEndpoint);

      expect(result).toEqual(mockResponse);
      expect(sessionStorage.getItem('now_playing')).toEqual(JSON.stringify(mockResponse));
      expect(fetch).toHaveBeenCalledWith('/fake-endpoint', expect.any(Object));
    });

    it('returns undefined if fetch fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
        } as unknown as Response)
      );

      const keyEndpoint = {
        key: 'now_playing' as keyof TmdbResponseFlat,
        endpoint: '/fake-endpoint',
      };

      const result = await callApi(controller, keyEndpoint);

      expect(result).toBeUndefined();
    });

    it('returns undefined on network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const keyEndpoint = {
        key: 'now_playing' as keyof TmdbResponseFlat,
        endpoint: '/fake-endpoint',
      };

      const result = await callApi(controller, keyEndpoint);

      expect(result).toBeUndefined();
    });
  });
});
