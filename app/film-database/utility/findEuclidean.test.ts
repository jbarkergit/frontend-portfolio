import { findEuclidean } from 'app/film-database/utility/findEuclidean';
import { expect, it } from 'vitest';

it('findEuclidean returns the index of the closest element', () => {
  const rects: DOMRect[] = [
    { left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 } as DOMRect,
    { left: 200, top: 200, right: 250, bottom: 250, width: 50, height: 50 } as DOMRect,
  ];

  expect(findEuclidean({ x: 50, y: 50 }, rects)).toBe(0);
  expect(findEuclidean({ x: 200, y: 200 }, rects)).toBe(1);
});
