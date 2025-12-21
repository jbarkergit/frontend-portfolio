import { useModalContext } from 'app/film-database/context/ModalContext';
import FDCineInfo from 'app/film-database/features/catalog/modals/cineInfo/FDCineInfo';
import FDCollections from 'app/film-database/features/catalog/modals/collections/FDCollections';
import FDPerson from 'app/film-database/features/catalog/modals/person/FDPerson';
import { useEffect, useRef } from 'react';

const FDModal = () => {
  const { modal, setModal } = useModalContext();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDocumentFlow = (isScrollable: boolean) => {
    if (isScrollable) document.body.style.removeProperty('overflow');
    else document.body.style.overflow = 'hidden';
  };

  const handleExteriorClicks = (event: PointerEvent): void => {
    if (!modalRef.current?.contains(event.target as Node)) {
      setModal(undefined);
      handleDocumentFlow(true);
    }
  };

  useEffect(() => {
    if (!modal) return;
    handleDocumentFlow(false);
    document.addEventListener('pointerdown', handleExteriorClicks);

    return () => {
      handleDocumentFlow(true);
      document.removeEventListener('pointerdown', handleExteriorClicks);
    };
  }, [modal]);

  const ariaLabel =
    modal === 'collections'
      ? 'User movie collections'
      : modal === 'movie'
        ? 'Movie details'
        : modal === 'person'
          ? 'Person details'
          : '';

  if (modal)
    return (
      <div className='fdModal'>
        <div
          className='fdModal__container'
          ref={modalRef}
          role='dialog'
          aria-modal='true'
          aria-label={ariaLabel}
          onClick={(e) => e.stopPropagation()}
        >
          {modal === 'movie' && <FDCineInfo />}
          {modal === 'collections' && <FDCollections />}
          {modal === 'person' && <FDPerson />}
        </div>
      </div>
    );
};

export default FDModal;
