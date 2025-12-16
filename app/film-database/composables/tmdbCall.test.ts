// /** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
// import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
// import * as tmdb from '~/film-database/composables/tmdbCall';

// const { tmdbCall, handleArg, callApi, createEndpoint, excludedCacheKeys } = tmdb;

// describe('tmdbCall', () => {
//   beforeEach(() => (global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })));

//   it('Prevents run time crashes caused by bad arguments', async () => {
//     await expect(tmdbCall(new AbortController(), 'not_playing' as any)).resolves.toMatchObject({
//       key: 'not_playing',
//       response: undefined,
//     });
//   });

//   it('tmdbCall arg validation', async () => {
//     const controller = new AbortController();

//     const string = await tmdbCall(controller, 'now_playing');
//     const object = await tmdbCall(controller, { credits: 123 });
//     const array = await tmdbCall(controller, ['now_playing', 'popular']);
//     const mixedArray = await tmdbCall(controller, ['now_playing', { credits: 321 }]);

//     expect(string).toBeDefined();
//     expect(object).toBeDefined();
//     expect(array).toBeDefined();
//     expectTypeOf(mixedArray).toBeArray();
//   });

//   it('handleArg either retrieves and parses cached items or calls callApi', async () => {
//     const controller = new AbortController();

//     // Should call callApi
//     const spy = vi.spyOn(global, 'fetch');
//     await handleArg(controller, excludedCacheKeys[0] as any, '');
//     expect(spy).toBeCalledTimes(1);

//     // Should retrieve item from cache and parse the data
//     const key = 'handleArgTest';
//     const cachedValue = { message: 'Hello, World.' };
//     sessionStorage.setItem(key, JSON.stringify(cachedValue));

//     const isNotCacheExcluded = await handleArg(controller, key as any, '');
//     expect(isNotCacheExcluded).toEqual(cachedValue);

//     sessionStorage.clear();
//   });

//   it('callApi has correct fetch options, including a controller signal', async () => {
//     const mockFetch = vi.spyOn(global, 'fetch');
//     const controller = new AbortController();

//     await callApi(controller, 'now_playing', undefined);

//     const call = mockFetch.mock.calls[0] as Parameters<typeof fetch>;
//     const [url, options] = call;

//     expect(url).toMatch(/now_playing/);
//     expect(options).toMatchObject({
//       method: 'GET',
//       headers: { accept: 'application/json', Authorization: expect.stringContaining('Bearer ') },
//       signal: expect.any(AbortSignal),
//     });
//   });

//   it('callApi caches items and handles cache key exceptions', async () => {
//     const controller = new AbortController();

//     // Shouldn't cache
//     await callApi(controller, excludedCacheKeys[0], '' as any);
//     const nullValue = sessionStorage.getItem(excludedCacheKeys[0]);
//     expect(nullValue).toBeNull();

//     // Should cache
//     const testKey = 'callApiTest';
//     await callApi(controller, testKey as any, '' as any);
//     const cachedValue = JSON.parse(sessionStorage.getItem(testKey)!);
//     expect(cachedValue).toBeDefined();
//   });

//   it('createEndpoint properly replaces placeholder text within desired endpoint for all potential arguments', () => {
//     expect(createEndpoint('not_a_arg' as any, undefined)).toBeUndefined();
//     expect(createEndpoint('now_playing', undefined)).toContain('now_playing');
//     expect(createEndpoint('credits', 123456)).toContain('123456');
//   });
// });
