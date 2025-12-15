import { TablerCategoryFilled } from 'app/film-database/assets/svg/icons';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { memo, useDeferredValue, useRef, useState, type ChangeEvent } from 'react';

type Props = {
  mapIndex: number;
  header: string;
};

const FDCollectionsCollectionHeader = memo(({ mapIndex, header }: Props) => {
  const { userCollections, setUserCollections } = useUserCollectionContext();
  const [inputValue, setInputValue] = useState<string>(
    userCollections[Object.keys(userCollections)[mapIndex]!]?.header || 'Unnamed Collection'
  );
  const deferredInputValue: string = useDeferredValue(inputValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    // Clear the previous timeout
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // Set a new timeout to delay the update
    const timeout = setTimeout(() => {
      const key = Object.keys(userCollections)[mapIndex];
      if (!key) return;

      setUserCollections((prevCarousels: any) => {
        const updatedCarousels = { ...prevCarousels };

        updatedCarousels[key] = {
          ...updatedCarousels[key],
          header: event.target.value,
        };

        return updatedCarousels;
      });
    }, 800);

    debounceTimeout.current = timeout;
  };

  // useEffect(() => {
  //   return () => {
  //     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  //   };
  // }, [debounceTimeout]);

  return (
    <header>
      <TablerCategoryFilled />
      <h2>
        {mapIndex === 0 ? (
          deferredInputValue
        ) : (
          <input
            type='text'
            value={header && header.length > 0 ? deferredInputValue : 'Unnamed Collection'}
            onChange={handleInputChange}
          />
        )}
      </h2>
    </header>
  );
});

export default FDCollectionsCollectionHeader;
