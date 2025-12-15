import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  displayName: string | null;
  email: string | null;
  uid: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const callback = (user: User | null) => {
      setUser(
        user
          ? {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
            }
          : null
      );
    };

    const authStateListener = onAuthStateChanged(firebaseAuth, callback);
    return () => authStateListener();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('A provider is required to consume useAuth.');
  }
  return context;
};
