import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types/auth.types';
import { TOKEN_KEY, USER_KEY } from '../api/axios.config';
import * as AuthApi from '../api/auth.api';

interface AuthContextValue {
  currentUser:    AuthResponse | null;
  isInitializing: boolean;
  isLoading:      boolean;
  loginError:     string | null;
  login:          (email: string, motDePasse: string) => Promise<void>;
  logout:         () => Promise<void>;
  clearLoginError:() => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser,    setCurrentUser]    = useState<AuthResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading,      setIsLoading]      = useState(false);
  const [loginError,     setLoginError]     = useState<string | null>(null);

  // Restaure la session au démarrage
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_KEY);
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        }
      } catch {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      } finally {
        setIsInitializing(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, motDePasse: string) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await AuthApi.login({ email, motDePasse });
      if (!response.success) {
        setLoginError(response.message ?? 'Connexion échouée.');
        return;
      }
      const user = response.data;
      if (user.role !== 'ROLE_PROPRIETAIRE') {
        setLoginError("Ce portail est réservé aux propriétaires d'entreprise.");
        return;
      }
      await AsyncStorage.setItem(TOKEN_KEY, user.accessToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } catch (error: any) {
      setLoginError(
        error?.response?.data?.message ?? 'Email ou mot de passe incorrect.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setCurrentUser(null);
  }, []);

  const clearLoginError = useCallback(() => setLoginError(null), []);

  return (
    <AuthContext.Provider value={{
      currentUser, isInitializing, isLoading,
      loginError, login, logout, clearLoginError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};