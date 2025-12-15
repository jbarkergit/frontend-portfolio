import { IcBaselineSearch } from 'app/film-database/assets/svg/icons';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { memo, useRef, type ChangeEvent } from 'react';

const FDSearchHeader = memo(
  ({
    setSearchResults,
  }: {
    setSearchResults: React.Dispatch<React.SetStateAction<TmdbMovieProvider[] | undefined>>;
  }) => {
    const labelRef = useRef<HTMLLabelElement>(null);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const searchTermRef = useRef<string>('');

    /** Handle label visibility */
    const handleLabelVisibility = (state: 'visible' | 'barelyVisible' | 'hidden') => {
      if (state !== 'hidden' && !searchTermRef.current.length) labelRef.current?.setAttribute('data-opacity', state);
      else labelRef.current?.setAttribute('data-opacity', 'hidden');
    };

    /** Debounced fetch */
    const fetch = async () => {
      const controller = new AbortController();
      const search = await tmdbCall(controller, { search: searchTermRef.current });
      if (search) setSearchResults(search.response.results);
      return () => controller.abort();
    };

    /** Handle input changes */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Set search term
      searchTermRef.current = e.target.value.trim().replaceAll(' ', '-').toLowerCase();

      // Update label visibility
      if (e.target.value.length) handleLabelVisibility('hidden');

      // Clear timeout
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // Assign timeout
      timeoutId.current = setTimeout(() => {
        if (searchTermRef.current.length) fetch();
      }, 850);
    };

    return (
      <div className='fdSearchBar__header'>
        <fieldset className='fdSearchBar__header__fieldset'>
          <label
            className='fdSearchBar__header__fieldset__label'
            htmlFor='fdSearchBar__fieldset__input'
            data-opacity='barelyVisible'
            ref={labelRef}>
            <IcBaselineSearch />
            <h2>Find the movies you're interested in</h2>
          </label>
          <input
            className='fdSearchBar__header__fieldset__input'
            type='search'
            pattern='search'
            autoFocus={true}
            onPointerOver={() => handleLabelVisibility('visible')}
            onPointerLeave={() => handleLabelVisibility('barelyVisible')}
            onFocus={() => handleLabelVisibility('visible')}
            onBlur={() => handleLabelVisibility('barelyVisible')}
            onChange={handleChange}
          />
        </fieldset>
      </div>
    );
  }
);

export default FDSearchHeader;
