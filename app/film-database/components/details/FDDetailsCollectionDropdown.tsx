import { TablerCategoryPlus } from 'app/film-database/assets/svg/icons';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { addIdToCollection } from 'app/film-database/utility/addIdToCollection';
import { memo, useCallback, useEffect, useRef } from 'react';

const FDDetailsCollectionDropdown = memo(() => {
  const { userCollections, setUserCollections } = useUserCollectionContext();
  const { heroData } = useHeroDataContext();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const attr: string = 'data-open';

  const handleExteriorClick = useCallback((event: PointerEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
      dropdownRef.current.setAttribute(attr, 'false');
    document.removeEventListener('pointerup', handleExteriorClick);
  }, []);

  const toggleDropdown = () => {
    if (!dropdownRef.current) return;

    const isOpen: boolean = dropdownRef.current.getAttribute(attr) === 'true';
    dropdownRef.current.setAttribute(attr, String(!isOpen));

    if (!isOpen) document.addEventListener('pointerup', handleExteriorClick);
  };

  useEffect(() => {
    return () => document.removeEventListener('pointerup', handleExteriorClick);
  }, []);

  return (
    <div className='fdDetails__extra__nav__collections'>
      <button aria-label={`Add ${heroData?.title} to a collection`} onClick={toggleDropdown}>
        Add to collections
      </button>
      <ul className='fdDetails__extra__nav__collections__dropdown' ref={dropdownRef} data-open='false'>
        {Object.entries(userCollections).map(([key, col], index) => {
          return (
            <li key={`detail-dropdown-${col.header}-${key}`}>
              <button
                aria-label={`Add ${heroData?.title} to collection ${col.header}`}
                onClick={() => {
                  if (heroData) {
                    const data = addIdToCollection(userCollections, {
                      data: [heroData],
                      colIndex: index,
                    });
                    setUserCollections(data);
                  }
                  toggleDropdown();
                }}
              >
                {col.header}
              </button>
            </li>
          );
        })}
        {Object.entries(userCollections).length < 5 ? (
          <li>
            <button
              aria-label={`Add ${heroData?.title} to a new collection`}
              onClick={() => {
                if (heroData) {
                  const data = addIdToCollection(userCollections, {
                    data: [heroData],
                    colIndex: Object.keys(userCollections).length + 1,
                  });
                  setUserCollections(data);
                }
                toggleDropdown();
              }}
            >
              <span>
                <TablerCategoryPlus />
              </span>
              New Collection
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
});

export default FDDetailsCollectionDropdown;
