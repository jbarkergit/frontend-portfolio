import { type ReactNode, useMemo, useContext, createContext, useRef } from 'react';

const Context = createContext<
  | {
      formRef: React.RefObject<HTMLFormElement | null>;
      stepsRef: React.RefObject<HTMLLIElement[]>;
      activeStepIndex: React.RefObject<number>;
      updateActiveStep: (delta: -1 | 1 | 0) => void;
    }
  | undefined
>(undefined);

export const FormActiveStepProvider = ({ children }: { children: ReactNode }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const stepsRef = useRef<HTMLLIElement[]>([]);
  const activeStepIndex = useRef<number>(0);

  const updateActiveStep = (delta: -1 | 1 | 0) => {
    // Initialize steps
    if (!stepsRef.current.length && formRef.current) {
      stepsRef.current = Array.from(formRef.current.children) as HTMLLIElement[];
    }

    // Identifiers
    const attr = 'data-toggle';
    const activeIndex = stepsRef.current.findIndex((step) => step.getAttribute(attr) === 'true');
    const targetIndex = Math.min(Math.max(delta === 0 ? 0 : activeIndex + delta, 0), stepsRef.current.length - 1);

    console.log(activeIndex);
    console.log(targetIndex);

    // Update DOM attributes
    for (let i = 0; i <= stepsRef.current.length - 1; i++) {
      const step = stepsRef.current[i];
      if (step) step.setAttribute(attr, i === targetIndex ? 'true' : 'false');
    }

    // Track active step
    activeStepIndex.current = targetIndex;
  };

  const value = useMemo(
    () => ({ formRef, stepsRef, activeStepIndex, updateActiveStep }),
    [formRef.current, stepsRef.current, activeStepIndex.current]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFormActiveStep = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume Form Active Step.');
  return context;
};
