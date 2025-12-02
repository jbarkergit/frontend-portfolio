import {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useState,
  useMemo,
  useContext,
  createContext,
} from 'react';

const Context = createContext<
  | {
      isBookingActive: boolean;
      setIsBookingActive: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const BookingActiveProvider = ({ children }: { children: ReactNode }) => {
  const [isBookingActive, setIsBookingActive] = useState<boolean>(false);
  const value = useMemo(() => ({ isBookingActive, setIsBookingActive }), [isBookingActive]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useBookingActive = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume BookingActive.');
  return context;
};
