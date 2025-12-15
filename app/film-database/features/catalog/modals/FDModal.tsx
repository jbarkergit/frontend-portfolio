import { useModalContext } from 'app/film-database/context/ModalContext';
import FDCineInfo from 'app/film-database/features/catalog/modals/cineInfo/FDCineInfo';
import FDCollections from 'app/film-database/features/catalog/modals/collections/FDCollections';
import FDPerson from 'app/film-database/features/catalog/modals/person/FDPerson';
import { useRef, useEffect } from 'react';

const FDModal = () => {
  const { modal, setModal } = useModalContext();
  const modalRef = useRef<HTMLDivElement>(null);

  /** Sets modal state (in context) to false when the user isn't directly interacting with modal */
  const handleExteriorClicks = (event: PointerEvent): void => {
    if (!modalRef.current?.contains(event.target as Node)) {
      setModal(undefined);
    }
  };

  /** Mount event listeners for @handleExteriorClicks */
  useEffect(() => {
    if (modal) document.addEventListener('pointerdown', handleExteriorClicks);
    return () => document.removeEventListener('pointerdown', handleExteriorClicks);
  }, [modal]);

  /** JSX */
  if (modal)
    return (
      <div className='fdModal'>
        <div
          className='fdModal__container'
          role='dialog'
          aria-modal='true'
          aria-label={
            modal === 'collections'
              ? 'User movie collections'
              : modal === 'movie'
                ? 'Movie details'
                : modal === 'person'
                  ? 'Person details'
                  : ''
          }
          ref={modalRef}>
          {modal === 'movie' && <FDCineInfo />}
          {modal === 'collections' && <FDCollections />}
          {modal === 'person' && <FDPerson />}
        </div>
      </div>
    );
};

export default FDModal;
