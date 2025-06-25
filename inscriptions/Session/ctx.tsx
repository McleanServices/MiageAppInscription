import { use, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => ({ success: false }),
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext
      value={{
        signIn: async (email: string, password: string) => {
          try {
            const response = await fetch('https://zq2s6rh4-8080.use.devtunnels.ms/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, mot_de_passe: password }),
            });
            const data = await response.json();
            if (!response.ok) {
              return { success: false, error: data.message || 'Erreur inconnue' };
            }
            // Optionally: store user info from data.utilisateur
            setSession('xxx');
            return { success: true };
          } catch (err) {
            return { success: false, error: 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.' };
          }
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}
