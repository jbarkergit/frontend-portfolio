import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import { type CSSProperties, memo, useEffect, useRef, useState } from 'react';

const FDAccountModalPoster = memo(() => {
  const { primaryData } = useFLoader();
  const nowPlaying = primaryData[0]?.response.results;
  if (!nowPlaying) return null;

  const [posters, setPosters] = useState<TmdbMovieProvider[]>([]);
  const indexQueue = useRef<number[]>([]);

  /** Fisher-Yates shuffle */
  const shuffleIndexes = (): void => {
    const indexes = [...Array(nowPlaying.length).keys()];
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    indexQueue.current = indexes;
  };

  /** Create a shuffled poster queue */
  const createPosters = (): void => {
    shuffleIndexes();
    const queue = indexQueue.current.map((i) => nowPlaying[i]).filter(Boolean) as TmdbMovieProvider[];
    setPosters(queue);
  };

  const shouldRender = window.innerWidth > 1250;

  /** Initialize poster queue once on mount */
  useEffect(() => {
    if (shouldRender) createPosters();
  }, [primaryData]);

  /** Interval to reshuffle posters */
  useEffect(() => {
    if (!shouldRender) return;

    const transitionDelay = 5700;
    const animationDuration = 700;
    const compensation = 300;
    const totalDuration = (nowPlaying.length - 2) * transitionDelay - animationDuration - compensation;

    const interval = setInterval(() => createPosters(), totalDuration);
    return () => clearInterval(interval);
  }, [shouldRender, nowPlaying.length]);

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
