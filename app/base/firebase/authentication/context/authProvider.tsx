import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, type Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';

interface AuthUser {
  displayName: string | null;
  email: string | null;
  uid: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isUserAuthorizing: boolean;
  setIsUserAuthorizing: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isUserAuthorizing, setIsUserAuthorizing] = useState<boolean>(true);

  useEffect(() => {
    const callback = (firebaseUser: User | null) => {
      setUser(
        firebaseUser
          ? {
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
            }
          : null
      );
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, callback);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isUserAuthorizing, setIsUserAuthorizing }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('A provider is required to consume useAuth.');
  return context;
};
