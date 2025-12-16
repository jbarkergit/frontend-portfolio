import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

type Route = 'home' | 'albums' | 'singlesAndEps' | 'compilations' | 'merch' | 'featuresAndMore';

const Context = createContext<
  | {
      tab: Route;
      setTab: Dispatch<SetStateAction<Route>>;
    }
  | undefined
>(undefined);

export const ArtistRouteProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<Route>('home');
  const value = useMemo(() => ({ tab, setTab }), [tab]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useArtistRouteContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume ArtistRoute.');
  return context;
};
