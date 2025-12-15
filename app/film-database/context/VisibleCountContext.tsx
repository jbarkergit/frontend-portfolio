import { useRootRefContext } from 'app/film-database/context/RootRefContext';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type CarouselVisibleQuantity = { viewport: number; modal: number };

const DEFAULT_QUANTITY: CarouselVisibleQuantity = { viewport: 2, modal: 2 };

const Context = createContext<
  | {
      visibleCount: CarouselVisibleQuantity;
      setVisibleCount: Dispatch<SetStateAction<CarouselVisibleQuantity>>;
    }
  | undefined
>(undefined);

export const VisibleCountProvider = ({ children }: { children: ReactNode }) => {
  const { root } = useRootRefContext();
  const [visibleCount, setVisibleCount] = useState(DEFAULT_QUANTITY);
  const value = useMemo(() => ({ visibleCount, setVisibleCount }), [visibleCount]);

  /**
   * Determine the number of items viewable within the viewport and modal widths
   * Supports variable screen sizes with adaptive variables
   */
  useEffect(() => {
    const updateVisibleCount = () => {
      if (!root.current) return;

      const computedStyle = getComputedStyle(root.current);
      const viewport =
        Number(computedStyle.getPropertyValue('--fd-carousel-items-per-page')) || DEFAULT_QUANTITY.viewport;
      const modal = Number(computedStyle.getPropertyValue('--fd-collection-items-per-page')) || DEFAULT_QUANTITY.modal;

      setVisibleCount({ viewport, modal });
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [root]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useVisibleCountContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume VisibleCount.');
  return context;
};
