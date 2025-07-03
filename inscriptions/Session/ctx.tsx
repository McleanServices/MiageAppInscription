import { use, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

// Define the user type based on your backend response
interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  type: string;
}

interface AuthSession {
  token: string;
  user: User;
}

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshUserData: () => void;
  session: AuthSession | null;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}>({
  signIn: async () => ({ success: false }),
  signOut: () => null,
  refreshUserData: () => null,
  session: null,
  user: null,
  token: null,
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
  const [[isLoading, sessionData], setSession] = useStorageState('session');

  // Parse the stored session data with better error handling
  let parsedSession: AuthSession | null = null;
  try {
    if (sessionData) {
      parsedSession = JSON.parse(sessionData);
      // Validate the parsed session structure
      if (!parsedSession?.token || !parsedSession?.user) {
        console.warn('Invalid session structure in storage');
        parsedSession = null;
      }
    }
  } catch (error) {
    console.error('Error parsing session data:', error);
    parsedSession = null;
    // Clear corrupted session data
    setSession(null);
  }

  const refreshUserData = () => {
    // Force re-read from storage by getting current value
    const currentSession = parsedSession;
    if (currentSession) {
      setSession(JSON.stringify(currentSession));
    }
  };

  return (
    <AuthContext
      value={{
        signIn: async (email: string, password: string) => {
          try {
            const response = await fetch('https://sunnysidecode.com/miageconnect/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, mot_de_passe: password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              return { success: false, error: data.message || 'Erreur inconnue' };
            }

            // Store the complete session data (token + user info)
            const sessionData: AuthSession = {
              token: data.token,
              user: {
                id: data.utilisateur.id,
                nom: data.utilisateur.nom,
                prenom: data.utilisateur.prenom,
                email: data.utilisateur.email,
                role: data.utilisateur.role,
                type: data.utilisateur.type,
              }
            };

            setSession(JSON.stringify(sessionData));
            return { success: true };
          } catch (err) {
            return { 
              success: false, 
              error: 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.' 
            };
          }
        },
        signOut: () => {
          setSession(null);
        },
        refreshUserData,
        session: parsedSession,
        user: parsedSession?.user || null,
        token: parsedSession?.token || null,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}

// Additional utility hooks for easier access to user data
export function useUser() {
  const { user } = useSession();
  return user;
}

export function useToken() {
  const { token } = useSession();
  return token;
}

// Enhanced utility hook for user data with refresh capability
export function useUserData() {
  const { user, isLoading, refreshUserData } = useSession();
  return { user, isLoading, refreshUserData };
}

// Helper function to make authenticated API calls
export function useAuthenticatedFetch() {
  const { token } = useSession();
  
  return async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication failed - token may be expired');
      // Could trigger signOut here if needed
    }

    return response;
  };
}
