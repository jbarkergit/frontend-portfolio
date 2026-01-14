import isUserAuthorized from 'app/base/firebase/authentication/utility/isUserAuthorized';
import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import { getFirestoreUserDocument } from 'app/base/firebase/firestore/utility/getFirestoreUserDocument';
import { updateFirestoreUserDocument } from 'app/base/firebase/firestore/utility/updateFirestoreUserDocument';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Represents a user's media collection in the catalog.
 * Contains the collection header and the media items it holds.
 */
export type UserCollection = {
  header: string;
  data: TmdbMovieProvider[];
};

const Context = createContext<
  | {
      userCollections: Record<string, UserCollection>;
      setUserCollections: Dispatch<SetStateAction<Record<string, UserCollection>>>;
    }
  | undefined
>(undefined);

export const UserCollectionProvider = ({ children }: { children: ReactNode }) => {
  const { primaryData } = useFLoader();

  const presetCollection = useMemo(() => {
    const firstEntry = primaryData[0];
    if (firstEntry) return firstEntry.response.results;
    else return undefined;
  }, [primaryData]);

  const [userCollections, setUserCollections] = useState<Record<string, UserCollection>>({
    'user-collection-0': {
      header: 'Trailer Queue',
      data: [],
    },
    'user-collection-1': {
      header: 'Now Playing',
      data: presetCollection ?? [],
    },
  });

  const value = useMemo(() => ({ userCollections, setUserCollections }), [userCollections]);

  useEffect(() => {
    if (!isUserAuthorized()) return;

    /**
     * If the user document has no collection, pre-populate it with film intelligence from clientLoader
     * If the user already has a collection, restore it from their document
     */
    const populateUserCollection = async (): Promise<void> => {
      const user = firebaseAuth.currentUser;
      if (!user?.email) return;

      const userDocument = await getFirestoreUserDocument();
      if (userDocument && Object.entries(userDocument.movies).length === 0) return;

      setUserCollections(
        Object.fromEntries(
          Object.entries(userDocument?.movies ?? {}).map(([key, movieCollection]) => [
            key,
            {
              header: movieCollection.header,
              data: movieCollection.data ?? [],
            },
          ])
        )
      );
    };

    populateUserCollection();
  }, []);

  /**
   * Update user document collection
   */
  useEffect(() => {
    if (!isUserAuthorized()) return;
    updateFirestoreUserDocument({ movies: userCollections });
  }, [userCollections]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useUserCollectionContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume UserCollection.');
  return context;
};
