import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import FDSearchHeader from 'app/film-database/features/catalog/media/search/FDSearchHeader';
import FDSearchResults from 'app/film-database/features/catalog/media/search/FDSearchResults';
import { useState, memo } from 'react';

const FDSearch = memo(({ orientation }: { orientation: 'desktop' | 'mobile' }) => {
  const [searchResults, setSearchResults] = useState<TmdbResponseFlat['search']['results'] | undefined>(undefined);

  return (
    <section
      className='fdSearchBar'
      data-orientation={orientation}>
      <FDSearchHeader setSearchResults={setSearchResults} />
      <FDSearchResults searchResults={searchResults} />
    </section>
  );
});

export default FDSearch;
