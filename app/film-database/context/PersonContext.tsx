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
      person: number | undefined;
      setPerson: Dispatch<SetStateAction<number | undefined>>;
    }
  | undefined
>(undefined);

export const PersonProvider = ({ children }: { children: ReactNode }) => {
  const [person, setPerson] = useState<number | undefined>(undefined);
  const value = useMemo(() => ({ person, setPerson }), [person]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const usePersonContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume Person.');
  return context;
};
