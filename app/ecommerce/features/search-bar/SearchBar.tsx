import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

function productSearch(searchTerm: string) {
  return commerceDatabase.filter((product) => product.sku.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 9);
}

const SearchBar = () => {
  const searchBarRef = useRef<HTMLDivElement>(null!);
  const [searchTerm, setSearchTerm] = useState<string>('');

  //** Exterior click handler */
  useEffect(() => {
    const exteriorClickHandler = (e: PointerEvent): void => {
      if (!searchBarRef.current?.contains(e.target as HTMLElement)) setSearchTerm('');
    };

    searchBarRef.current?.addEventListener('pointerup', exteriorClickHandler);
    document.body.addEventListener('pointerup', exteriorClickHandler);

    return () => {
      searchBarRef.current?.removeEventListener('pointerup', exteriorClickHandler);
      document.body.removeEventListener('pointerup', exteriorClickHandler);
    };
  }, []);

  const searchResults = productSearch(searchTerm);

  return (
    <div className='searchBar' ref={searchBarRef}>
      <label className='searchBar__label' htmlFor='searchBar__input'>
        Search Products
      </label>
      <input
        className='searchBar__input'
        id='searchBar__input'
        data-focus={searchTerm.length > 0 ? 'true' : 'false'}
        type='text'
        placeholder='Search products'
        value={searchTerm.replace('-', ' ')}
        autoCapitalize='none'
        autoComplete='none'
        autoCorrect='off'
        spellCheck='false'
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e?.target.value.replace(' ', '-'));
        }}
      />
      {searchTerm.length > 0 && (
        <div className='searchBar__return'>
          <ul className='searchBar__return__ul' tabIndex={-1}>
            {searchResults.length <= 0 ? (
              <li className='searchBar__return__ul__li'>
                <span className='searchBar__return__ul__li--noResult'>Sorry, no results.</span>
              </li>
            ) : (
              searchResults.map((product) => (
                <li className='searchBar__return__ul__li' key={product.sku}>
                  <Link to={`/ecommerce/products/${product.sku}`} onClick={() => setSearchTerm('')}>
                    {product.company} {product.unit}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
