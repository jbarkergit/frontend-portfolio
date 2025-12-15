import { IcOutlinePlayCircle } from 'app/film-database/assets/svg/icons';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useVisibleCountContext } from 'app/film-database/context/VisibleCountContext';

const FDSearchResults = ({ searchResults }: { searchResults: TmdbMovieProvider[] | undefined }) => {
  const { setHeroData } = useHeroDataContext();
  const { visibleCount } = useVisibleCountContext();

  return (
    <div
      className='fdSearchBar__results'
      data-anim={searchResults && searchResults.length ? 'enabled' : 'disabled'}>
      <ul className='fdSearchBar__results__ul'>
        {searchResults && searchResults.length
          ? searchResults.slice(0, visibleCount.viewport).map((props, index) => (
              <li
                className='fdSearchBar__results__ul__li'
                key={`fd-search-result-${index}`}>
                <picture className='fdSearchBar__results__ul__li__article'>
                  <img
                    src={`https://image.tmdb.org/t/p/w780${props.poster_path}`}
                    alt={`${props.title}`}
                  />
                </picture>
                <div
                  className='fdSearchBar__results__ul__li__overlay'
                  onClick={() => setHeroData(props)}>
                  <button
                    className='fdSearchBar__results__ul__li__overlay--play'
                    aria-label='Play trailer'>
                    <IcOutlinePlayCircle />
                  </button>
                </div>
              </li>
            ))
          : Array.from({ length: visibleCount.viewport }).map((_, i) => (
              <li
                className='fdSearchBar__results__ul__li'
                key={`fd-search-result-placeholder-${i}`}></li>
            ))}
      </ul>
    </div>
  );
};

export default FDSearchResults;
