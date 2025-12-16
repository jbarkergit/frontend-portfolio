import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { NavigationKeys } from '~/spotify-visualizer/features/navigation/Navigation';
import type { LibraryKeys } from '~/spotify-visualizer/features/sidebar/Sidebar';

type Route = NavigationKeys | LibraryKeys | undefined;

const Context = createContext<
  | {
      route: Route;
      setRoute: Dispatch<SetStateAction<Route>>;
    }
  | undefined
>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [route, setRoute] = useState<Route>(undefined);
  const value = useMemo(() => ({ route, setRoute }), [route]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRouteContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume Route.');
  return context;
};
