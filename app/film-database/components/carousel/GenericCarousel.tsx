import { SvgSpinnersRingResize } from 'app/film-database/assets/svg/icons';
import GenericCarouselNavigation from 'app/film-database/components/carousel/GenericCarouselNavigation';
import GenericCarouselPoster from 'app/film-database/components/carousel/GenericCarouselPoster';
import type { TmdbMovieProvider, TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useVisibleCountContext } from 'app/film-database/context/VisibleCountContext';
import { useRef, useEffect, memo } from 'react';

export type GenericCarouselMap = {
  media: TmdbMovieProvider[];
  cinemaInformation: TmdbResponseFlat['credits']['cast'] | TmdbResponseFlat['credits']['crew'];
  person: TmdbResponseFlat['personCredits']['cast'] | TmdbResponseFlat['personCredits']['crew'];
};

function Carousel<CN extends keyof GenericCarouselMap>({
  carouselIndex,
  carouselName,
  heading,
  data,
}: {
  carouselIndex: number;
  carouselName: CN;
  heading: string;
  data: GenericCarouselMap[CN];
}) {
  const { visibleCount } = useVisibleCountContext();
  const carouselRef = useRef<HTMLUListElement>(null);
  const isModal: boolean =
    carouselName === 'media'
      ? false
      : carouselName === 'cinemaInformation'
        ? true
        : carouselName === 'person'
          ? true
          : false;

  /** Handles visibility of list items as the user scrolls */
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const listItems = Array.from(carouselRef.current.children) as HTMLLIElement[];
      const rect = carouselRef.current.getBoundingClientRect();

      for (const li of listItems) {
        const liRect = li.getBoundingClientRect();
        if (liRect.left < rect.right && liRect.right > rect.left) {
          if (li.getAttribute('data-hidden') === 'true') {
            li.setAttribute('data-hidden', 'false');
          }
        }
      }
    };

    carouselRef.current?.addEventListener('scroll', handleScroll);
    return () => carouselRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className='genericCarousel'
      data-anim='active'>
      <header className='genericCarousel__header'>
        <h2 className='genericCarousel__header--h2'>{heading.replaceAll('_', ' ')}</h2>
      </header>
      <div className='genericCarousel__wrapper'>
        <ul
          className='genericCarousel__wrapper__ul'
          ref={carouselRef}
          data-modal={carouselName}>
          {data.length
            ? data.flat().map((entry, posterIndex) => (
                <GenericCarouselPoster
                  carouselName={carouselName}
                  carouselIndex={carouselIndex}
                  posterIndex={posterIndex}
                  entry={entry}
                  key={`${carouselName}-carousel-${carouselIndex}-li-${posterIndex}`}
                />
              ))
            : Array.from({ length: isModal ? visibleCount.modal : visibleCount.viewport }).map((_, i) => (
                <li
                  className='genericCarousel__wrapper__ul__loading'
                  key={`generic-carousel-${carouselName}-ul-loader-${i}`}>
                  <SvgSpinnersRingResize />
                </li>
              ))}
        </ul>
        <GenericCarouselNavigation
          dataLength={data.length}
          reference={carouselRef}
          isModal={isModal}
        />
      </div>
    </section>
  );
}

const GenericCarousel = memo(Carousel);

export default GenericCarousel;
