import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import { type CSSProperties, memo, useEffect, useRef, useState } from 'react';

const FDAccountModalPoster = memo(() => {
  const { primaryData } = useFLoader();
  const nowPlaying = primaryData[0]?.response.results;
  if (!nowPlaying) return;

  const [posters, setPosters] = useState<TmdbMovieProvider[]>([]);
  const indexQueue = useRef<number[]>([]);

  /** Randomly shuffle indexQueue within bounds of the films array. */
  const shuffleIndexes = (): void => {
    const isIndexQueueFull: boolean = indexQueue.current.length >= nowPlaying.length;
    const nextQueue: number[] = isIndexQueueFull ? indexQueue.current : [...nowPlaying.keys()];

    // Fisher-Yates shuffle
    for (let i = nextQueue.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));

      const valI: number | undefined = nextQueue[i];
      const valJ: number | undefined = nextQueue[j];

      if (typeof valI === 'number' && typeof valJ === 'number') {
        [nextQueue[i], nextQueue[j]] = [valJ, valI];
      } else {
        console.error('Failure to shuffle poster indexes.');
      }
    }

    indexQueue.current = nextQueue;
  };

  /** Generate a random queue of film posters for the fade effect */
  const createPosters = (): void => {
    shuffleIndexes();
    let queue: typeof posters = [];

    for (let i = 0; i < nowPlaying.length - 1; i++) {
      const j: number | undefined = indexQueue.current[i];
      if (j && nowPlaying[0]) queue.push(nowPlaying[j]!);
    }

    setPosters(queue);
  };

  const shouldRender: boolean = window.innerWidth > 1250;

  useEffect(() => {
    if (shouldRender) createPosters();
  }, [primaryData]);

  useEffect(() => {
    if (shouldRender) {
      const transitionDelay: number = 5700;
      const animationDuration: number = 700;
      const compensation: number = 300;
      const totalDuration: number = (posters.length - 2) * transitionDelay - animationDuration - compensation;
      const interval: NodeJS.Timeout = setInterval(() => createPosters(), totalDuration);
      return () => clearInterval(interval);
    }
  }, [posters]);

  return (
    <div className='fdAccount__container__wrapper'>
      <picture>
        {posters.map((poster, index) => (
          <img
            key={poster.poster_path}
            fetchPriority={index === posters.length - 1 ? 'high' : 'low'}
            src={`https://image.tmdb.org/t/p/original/${poster.poster_path}`}
            alt={poster.title}
            style={{ '--i': posters.length - index } as CSSProperties}
          />
        ))}
      </picture>
    </div>
  );
});

export default FDAccountModalPoster;
