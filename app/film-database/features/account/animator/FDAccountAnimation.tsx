import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import { type CSSProperties, memo, useEffect, useMemo, useRef, useState } from 'react';

// Find the visual center of an array's length
const getCenteredIndex = (length: number) => Math.round((length - 1) / 2);

// Constants
const totalSets: number = 5;
const totalSetPosters: number = 4;

const FDAccountAnimation = memo(({ accountRef }: { accountRef: React.RefObject<HTMLDivElement | null> }) => {
  const { primaryData } = useFLoader();
  const [allPosters, setAllPosters] = useState<TmdbMovieProvider[][]>();
  const animationRef = useRef<HTMLDivElement>(null);

  // Create 5 sets of 4 posters
  useEffect(() => {
    const posters: TmdbMovieProvider[][] = [];
    let dataIteration = 0;
    let buffer: TmdbMovieProvider[] = [];

    while (posters.length < totalSets && dataIteration < primaryData.length) {
      const currentData = primaryData[dataIteration]?.response.results ?? [];

      // Merge left over posters from previous results
      buffer = buffer.concat(currentData);

      // While a full set of 4 is possible
      while (buffer.length >= totalSetPosters && posters.length < totalSets) {
        posters.push(buffer.splice(0, totalSetPosters));
      }

      // If no more posters are available, move on to the next data set from primaryData
      dataIteration++;
    }

    setAllPosters(posters);
  }, [primaryData]);

  const mostCenteredImageID: number = useMemo(() => {
    if (!allPosters) return -1;

    const middleSet = allPosters[getCenteredIndex(allPosters.length)];
    if (!middleSet?.length) return -1;

    const middleItem = middleSet?.[getCenteredIndex(middleSet.length)];
    return middleItem?.id ?? -1;
  }, [allPosters]);

  /** Unmount animator */
  const unmountAnimation = (): void => {
    if (!animationRef.current || !accountRef.current) return;
    const attribute: string = 'data-visible';
    animationRef.current.setAttribute(attribute, 'false');
    accountRef.current.setAttribute(attribute, 'true');
  };

  return (
    <div className='fdAccountAnimation'>
      <div
        className='fdAccountAnimation__backdrop'
        ref={animationRef}
        data-visible='false'
        onAnimationEnd={unmountAnimation}
      >
        {allPosters?.map((set: TmdbMovieProvider[], setIndex: number) => (
          <ul className='fdAccountAnimation__backdrop__set' key={`backdrop-set-${setIndex}`}>
            {set.map((article: TmdbMovieProvider, index: number) => {
              const isLast = setIndex === allPosters.length - 1 && index === set.length - 1;

              return (
                <li
                  className='fdAccountAnimation__backdrop__set__li'
                  key={`backdrop-image-${article.id}`}
                  style={{ '--i': index } as CSSProperties}
                >
                  <picture className='fdAccountAnimation__backdrop__set__li__container'>
                    <img
                      className='fdAccountAnimation__backdrop__set__li__container--img'
                      src={`https://image.tmdb.org/t/p/${
                        article.id === mostCenteredImageID ? `original` : `w780`
                      }/${article?.backdrop_path}`}
                      alt={article?.title}
                      onLoad={() => {
                        if (isLast) animationRef.current?.setAttribute('data-visible', 'true');
                      }}
                    />
                  </picture>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
});

export default FDAccountAnimation;
