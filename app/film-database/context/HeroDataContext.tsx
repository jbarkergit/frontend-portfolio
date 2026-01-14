import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

const Context = createContext<
  | {
      heroData: TmdbMovieProvider | undefined;
      setHeroData: Dispatch<SetStateAction<TmdbMovieProvider | undefined>>;
    }
  | undefined
>(undefined);

export const HeroDataProvider = ({ children }: { children: ReactNode }) => {
  const { primaryData } = useFLoader();
  const [heroData, setHeroData] = useState<TmdbMovieProvider | undefined>(
    primaryData[0] ? primaryData[0].response.results[0] : undefined
  );
  const value = useMemo(() => ({ heroData, setHeroData }), [heroData]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useHeroDataContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume HeroData.');
  return context;
};
