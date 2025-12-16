import { BxDotsVerticalRounded, IcOutlinePlayCircle, TablerCategoryPlus } from 'app/film-database/assets/svg/icons';
import type { GenericCarouselMap } from 'app/film-database/components/carousel/GenericCarousel';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { usePersonContext } from 'app/film-database/context/PersonContext';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { useVisibleCountContext } from 'app/film-database/context/VisibleCountContext';
import { addIdToCollection } from 'app/film-database/utility/addIdToCollection';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

function GenericCarouselPoster<K extends keyof GenericCarouselMap>({
  carouselName,
  carouselIndex,
  posterIndex,
  entry,
}: {
  carouselName: K;
  carouselIndex: number;
  posterIndex: number;
  entry: GenericCarouselMap[K][number];
}) {
  const { userCollections, setUserCollections } = useUserCollectionContext();
  const { setHeroData } = useHeroDataContext();
  const { visibleCount } = useVisibleCountContext();
  const { setModal } = useModalContext();
  const { setPerson } = usePersonContext();
  const { setModalTrailer } = useModalTrailerContext();

  const isModal: boolean =
    carouselName === 'media'
      ? false
      : carouselName === 'cinemaInformation'
        ? true
        : carouselName === 'person'
          ? true
          : false;

  const [isInterested, setIsInterested] = useState<boolean>(false);

  const itemCount = isModal ? visibleCount.modal : visibleCount.viewport;

  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleExteriorClick = useCallback((event: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      dropdownRef.current.setAttribute('data-open', 'false');
    }
  }, []);

  const toggleDropdown = () => {
    if (!dropdownRef.current) return;
    const isOpen = dropdownRef.current.getAttribute('data-open') === 'true';
    dropdownRef.current.setAttribute('data-open', String(!isOpen));
    if (isOpen) document.addEventListener('pointerup', handleExteriorClick);
    else document.removeEventListener('pointerup', handleExteriorClick);
  };

  useEffect(() => {
    return () => document.removeEventListener('pointerup', handleExteriorClick);
  }, []);

  /** @Parent */
  const Parent = ({ children }: { children: ReactNode }) => (
    <li className='genericCarousel__wrapper__ul__li' data-hidden={posterIndex < itemCount + 1 ? 'false' : 'true'}>
      {children}
    </li>
  );

  /** @JSX */
  if (carouselName === 'media') {
    const mediaEntry = entry as GenericCarouselMap['media'][number];
    return (
      <li
        className='genericCarousel__wrapper__ul__li'
        onPointerOver={() => setIsInterested(true)}
        onPointerLeave={() => dropdownRef.current?.setAttribute('data-open', 'false')}
        data-hidden={posterIndex < itemCount + 1 ? 'false' : 'true'}
      >
        <picture className='genericCarousel__wrapper__ul__li__picture'>
          <img
            className='genericCarousel__wrapper__ul__li__picture--img'
            src={`https://image.tmdb.org/t/p/w500/${mediaEntry.poster_path}`}
            alt={`${mediaEntry.title}`}
            fetchPriority={carouselIndex === 0 ? 'high' : 'low'}
            loading={carouselIndex === 0 ? 'eager' : 'lazy'}
          />
        </picture>
        {isInterested && (
          <>
            <div className='genericCarousel__wrapper__ul__li__overlay'>
              <button
                className='genericCarousel__wrapper__ul__li__overlay--toggleMenu'
                aria-label='Add movie to collections'
                onClick={toggleDropdown}
              >
                <BxDotsVerticalRounded />
              </button>
              <button
                className='genericCarousel__wrapper__ul__li__overlay--play'
                aria-label='Play trailer'
                onClick={() => setHeroData(mediaEntry)}
              >
                <IcOutlinePlayCircle />
              </button>
            </div>
            <ul className='genericCarousel__wrapper__ul__li__collections' ref={dropdownRef} data-open='false'>
              {Object.entries(userCollections).map(([key, collection], i) => {
                return (
                  <li
                    key={`${carouselName}-carousel-${carouselIndex}-poster-${posterIndex}-collection-dropdown-${i}-${key}`}
                  >
                    <button
                      aria-label={`Add movie to ${collection.header}`}
                      onClick={() => {
                        const data = addIdToCollection(userCollections, {
                          data: [mediaEntry],
                          colIndex: i,
                        });
                        setUserCollections(data);

                        toggleDropdown();
                      }}
                    >
                      {collection.header}
                    </button>
                  </li>
                );
              })}
              {Object.entries(userCollections).length < 5 ? (
                <li className='genericCarousel__wrapper__ul__li__collections__mtnc'>
                  <button
                    aria-label='Add movie to a new collection'
                    onClick={() => {
                      const data = addIdToCollection(userCollections, {
                        data: [mediaEntry],
                        colIndex: Object.keys(userCollections).length + 1,
                      });
                      setUserCollections(data);

                      toggleDropdown();
                    }}
                  >
                    <TablerCategoryPlus /> New Collection
                  </button>
                </li>
              ) : null}
            </ul>
          </>
        )}
      </li>
    );
  } else if (carouselName === 'cinemaInformation') {
    const cinemaEntry = entry as GenericCarouselMap['cinemaInformation'][number];
    return (
      <Parent>
        <button
          aria-label={`Read more about ${cinemaEntry.name}`}
          onClick={() => {
            setModal('person');
            setPerson(cinemaEntry.id);
          }}
        >
          <picture
            className='genericCarousel__wrapper__ul__li__picture'
            data-missing={cinemaEntry.profile_path ? 'false' : 'true'}
          >
            {cinemaEntry.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500/${cinemaEntry.profile_path}`}
                alt={`${cinemaEntry.name}`}
                fetchPriority={carouselIndex <= itemCount ? 'high' : 'low'}
              />
            ) : (
              <img
                src={`https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg`}
                alt={`${cinemaEntry.name}`}
                fetchPriority='low'
              />
            )}
          </picture>
          <div className='genericCarousel__wrapper__ul__li__member'>
            <span>{cinemaEntry.name}</span>
            {/* @ts-ignore */}
            <span>{cinemaEntry.character}</span>
            <span>{cinemaEntry.known_for_department !== 'Acting' ? cinemaEntry.known_for_department : null}</span>
          </div>
        </button>
      </Parent>
    );
  } else if (carouselName === 'person') {
    const mediaEntry = entry as GenericCarouselMap['media'][number];
    return (
      <li
        className='genericCarousel__wrapper__ul__li'
        onPointerDown={() => {
          setModalTrailer(mediaEntry);
          setModal('movie');
        }}
        onPointerLeave={() => dropdownRef.current?.setAttribute('data-open', 'false')}
        data-hidden={posterIndex < itemCount + 1 ? 'false' : 'true'}
      >
        <picture className='genericCarousel__wrapper__ul__li__picture'>
          <img
            className='genericCarousel__wrapper__ul__li__picture--img'
            src={`https://image.tmdb.org/t/p/w500/${mediaEntry.poster_path}`}
            alt={`${mediaEntry.title}`}
            fetchPriority={carouselIndex === 0 ? 'high' : 'low'}
          />
        </picture>
        <div className='genericCarousel__wrapper__ul__li__overlay' />
      </li>
    );
  } else {
    console.error('Invalid carouselName');
    return null;
  }
}

export default GenericCarouselPoster;
