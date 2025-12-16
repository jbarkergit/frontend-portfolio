import { PersonProvider } from 'app/film-database/context/PersonContext';
import { useRootRefContext } from 'app/film-database/context/RootRefContext';
import { VisibleCountProvider } from 'app/film-database/context/VisibleCountContext';
import FDHero from 'app/film-database/features/catalog/hero/FDHero';
import FDMedia from 'app/film-database/features/catalog/media/FDMedia';
import FDModal from 'app/film-database/features/catalog/modals/FDModal';

const FDCatalog = () => {
  const { root } = useRootRefContext();

  return (
    <div className='fdCatalog' ref={root} data-layout-carousel data-layout-collection>
      <FDHero />
      <PersonProvider>
        <VisibleCountProvider>
          <FDMedia />
          <FDModal />
        </VisibleCountProvider>
      </PersonProvider>
    </div>
  );
};

export default FDCatalog;
