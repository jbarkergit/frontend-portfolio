import { useAuth } from 'app/base/firebase/authentication/context/authProvider';
import { HeroDataProvider } from 'app/film-database/context/HeroDataContext';
import { ModalProvider } from 'app/film-database/context/ModalContext';
import { ModalDataProvider } from 'app/film-database/context/ModalDataContext';
import { RootRefProvider } from 'app/film-database/context/RootRefContext';
import { UserCollectionProvider } from 'app/film-database/context/UserCollectionContext';
import FDAccountModal from 'app/film-database/features/account/auth-modal/FDAccountModal';
import { useRef } from 'react';
import { useLoaderData } from 'react-router';
import { tmdbCall } from '../composables/tmdbCall';
import FDAccountAnimation from '../features/account/animator/FDAccountAnimation';
import FDCatalog from '../features/catalog/FDCatalog';
import FDHeader from '../features/catalog/navigation/FDHeader';

export async function clientLoader() {
  const primaryData = await tmdbCall(new AbortController(), [
    'now_playing',
    'upcoming',
    'trending_today',
    'trending_this_week',
    'popular',
    'top_rated',
    { discover: 'action' },
    { discover: 'adventure' },
    { discover: 'animation' },
    { discover: 'comedy' },
    { discover: 'crime' },
    { discover: 'documentary' },
    { discover: 'drama' },
    { discover: 'family' },
    { discover: 'fantasy' },
    { discover: 'history' },
    { discover: 'horror' },
    { discover: 'music' },
    { discover: 'mystery' },
    { discover: 'romance' },
    { discover: 'science_fiction' },
    { discover: 'thriller' },
    { discover: 'tv_movie' },
    { discover: 'war' },
    { discover: 'western' },
  ]);

  return { primaryData };
}

export const useFLoader = () => useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;

export default function FilmDatabase() {
  const { user } = useAuth();
  const accountRef = useRef<HTMLDivElement>(null);

  return user ? (
    <div className='filmDatabase'>
      <RootRefProvider>
        <ModalProvider>
          <HeroDataProvider>
            <UserCollectionProvider>
              <ModalDataProvider>
                <FDHeader />
                <FDCatalog />
              </ModalDataProvider>
            </UserCollectionProvider>
          </HeroDataProvider>
        </ModalProvider>
      </RootRefProvider>
    </div>
  ) : (
    <>
      <FDAccountAnimation accountRef={accountRef} />
      <FDAccountModal ref={accountRef} />
    </>
  );
}
