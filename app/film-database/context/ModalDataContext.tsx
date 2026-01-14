import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
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
      modalData: TmdbMovieProvider | undefined;
      setModalData: Dispatch<SetStateAction<TmdbMovieProvider | undefined>>;
    }
  | undefined
>(undefined);

export const ModalDataProvider = ({ children }: { children: ReactNode }) => {
  const [modalData, setModalData] = useState<TmdbMovieProvider | undefined>(undefined);
  const value = useMemo(() => ({ modalData, setModalData }), [modalData]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useModalDataContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume ModalTrailer.');
  return context;
};
