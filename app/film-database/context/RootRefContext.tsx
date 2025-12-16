import { createContext, type ReactNode, type RefObject, useContext, useRef } from 'react';

const Context = createContext<
  | {
      root: RefObject<HTMLDivElement | null>;
    }
  | undefined
>(undefined);

export const RootRefProvider = ({ children }: { children: ReactNode }) => {
  const root = useRef<HTMLDivElement>(null);
  return <Context.Provider value={{ root }}>{children}</Context.Provider>;
};

export const useRootRefContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume RootRef.');
  return context;
};
