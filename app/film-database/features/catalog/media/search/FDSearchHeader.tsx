import { IcBaselineSearch } from 'app/film-database/assets/svg/icons';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { type ChangeEvent, memo, useEffect, useRef } from 'react';

const FDSearchHeader = memo(
  ({
    setSearchResults,
  }: {
    setSearchResults: React.Dispatch<React.SetStateAction<TmdbMovieProvider[] | undefined>>;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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

    /** Auto focus */
    useEffect(() => {
      if (!containerRef.current || !inputRef.current) return;

      let hasFocused = false;

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry || !inputRef.current) return;

        if (entry.isIntersecting && window.innerWidth > 950 && !hasFocused) {
          inputRef.current.focus();
          hasFocused = true;
        }
      });

      const handlePointerDown = (e: PointerEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          hasFocused = false;
        }
      };

      observer.observe(containerRef.current);
      document.addEventListener('pointerdown', handlePointerDown);

      return () => {
        observer.disconnect();
        document.removeEventListener('pointerdown', handlePointerDown);
      };
    }, []);

    return (
      <div className='fdSearchBar__header' ref={containerRef}>
        <fieldset className='fdSearchBar__header__fieldset'>
          <label
            className='fdSearchBar__header__fieldset__label'
            htmlFor='fdSearchBar__fieldset__input'
            data-opacity='barelyVisible'
            ref={labelRef}
          >
            <IcBaselineSearch />
            <h2>Find the movies you're interested in</h2>
          </label>
          <input
            className='fdSearchBar__header__fieldset__input'
            ref={inputRef}
            type='search'
            pattern='search'
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
