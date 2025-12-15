import FDiFrame from 'app/film-database/components/iframe/FDiFrame';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import FDCollectionsCollection from 'app/film-database/features/catalog/modals/collections/FDCollectionsCollection';
import FDCollectionsErrorHandler from 'app/film-database/features/catalog/modals/collections/FDCollectionsErrorHandler';
import FDCollectionsMenu from 'app/film-database/features/catalog/modals/collections/FDCollectionsMenu';
import { useState, useRef, useCallback, useEffect } from 'react';

const FDCollections = () => {
  const { userCollections } = useUserCollectionContext(); // Context
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Edit mode flag
  const errorRef = useRef<HTMLDivElement>(null); // Reference storage to errors occuring in the drop and drag logic
  const ulRefs = useRef<HTMLUListElement[]>([]); // Collection of mapped ULs, must live within this scope

  /** Stores unordered list dom nodes as an array reference */
  const passRefToArray = (reference: HTMLUListElement): void => {
    if (reference && !ulRefs.current.includes(reference)) {
      ulRefs.current.push(reference);
    }
  };

  /** Handles visibility of the errors notifcation */
  const triggerError = useCallback((): void => {
    const attr: string = 'data-error';
    errorRef.current?.setAttribute(attr, 'true');
    setTimeout(() => errorRef.current?.setAttribute(attr, 'false'), 3200);
  }, []);

  /** Handles interaction visual indicators via dom node attributes for 'data-list-item-fx' */
  useEffect(() => {
    const toggleVisibility = () => {
      if (ulRefs.current) {
        for (let i = 0; i < ulRefs.current.length; i++) {
          const ul = ulRefs.current[i];
          if (!ul || i === 0) continue;
          ul.setAttribute('data-list-item-fx', !isEditMode ? 'true' : 'false');
        }
      }
    };

    toggleVisibility();
  }, [isEditMode]);

  return (
    <>
      <FDiFrame type='modal' />
      <section className='fdCollections'>
        {Object.values(userCollections).map(({ header, data }, index) => (
          <FDCollectionsCollection
            key={`user-collections-collection-${index}`}
            ref={(node) => {
              if (node) passRefToArray(node);
            }}
            mapIndex={index}
            header={header}
            data={data}
            isEditMode={isEditMode}
            ulRefs={ulRefs}
            triggerError={triggerError}
          />
        ))}
      </section>
      <FDCollectionsMenu
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      <FDCollectionsErrorHandler ref={errorRef} />
    </>
  );
};

export default FDCollections;
