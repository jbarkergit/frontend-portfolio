import { createContext, type ReactNode, useContext, useState } from 'react';

const Context = createContext<
  | {
      playerVolume: number;
      setPlayerVolume: React.Dispatch<React.SetStateAction<number>>;
    }
  | undefined
>(undefined);

export const PlayerVolumeProvider = ({ children }: { children: ReactNode }) => {
  const [playerVolume, setPlayerVolume] = useState<number>(0);

  return <Context.Provider value={{ playerVolume, setPlayerVolume }}>{children}</Context.Provider>;
};

export const usePlayerVolumeContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('A provider is required to consume ChunkSize.');
  return context;
};
