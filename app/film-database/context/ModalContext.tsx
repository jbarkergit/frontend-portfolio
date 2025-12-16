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
      modal: 'collections' | 'movie' | 'person' | undefined;
      setModal: Dispatch<SetStateAction<'collections' | 'movie' | 'person' | undefined>>;
    }
  | undefined
>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<'collections' | 'movie' | 'person' | undefined>(undefined);
  const value = useMemo(() => ({ modal, setModal }), [modal]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useModalContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume Modal.');
  return context;
};
