import { TablerCategoryPlus, TablerEdit, MaterialSymbolsLogoutSharp } from 'app/film-database/assets/svg/icons';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { addIdToCollection } from 'app/film-database/utility/addIdToCollection';
import { type Dispatch, type SetStateAction, memo, useRef, useEffect } from 'react';

type Props = {
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
};

const FDCollectionsMenu = memo(({ isEditMode, setIsEditMode }: Props) => {
  const { userCollections, setUserCollections } = useUserCollectionContext();
  const { setModal } = useModalContext();
  const editBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editBtnRef.current) {
      editBtnRef.current.setAttribute('data-toggle', String(isEditMode));
    }
  }, [isEditMode]);

  /** @returns */
  return (
    <div className='fdCollectionsMenu'>
      <button
        className='fdCollectionsMenu--collection'
        aria-label='Create new list'
        onClick={() => {
          const data = addIdToCollection(userCollections, {
            data: undefined,
            colIndex: Object.keys(userCollections).length + 1,
          });
          setUserCollections(data);
        }}>
        <TablerCategoryPlus />
      </button>
      <button
        ref={editBtnRef}
        className='fdCollectionsMenu--edit'
        aria-label='Switch to edit mode'
        data-toggle='false'
        onClick={() => setIsEditMode((state) => !state)}>
        <TablerEdit />
      </button>
      <button
        className='fdCollectionsMenu--close'
        aria-label='Close collections modal'
        onClick={() => setModal(undefined)}>
        <MaterialSymbolsLogoutSharp />
      </button>
    </div>
  );
});

export default FDCollectionsMenu;
