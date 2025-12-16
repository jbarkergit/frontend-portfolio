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
      errors: Record<string, string>;
      setErrors: Dispatch<SetStateAction<Record<string, string>>>;
    }
  | undefined
>(undefined);

export const FormErrorsProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const value = useMemo(() => ({ errors, setErrors }), [errors]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFormErrors = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume Form Errors.');
  return context;
};
