import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  user: User;
  token: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [userInfo, tokenInfo] = await AsyncStorage.multiGet([
        '@GoBarber:user',
        '@GoBarber:token',
      ]);

      if (userInfo[1] && tokenInfo[1]) {
        const user = JSON.parse(userInfo[1]);
        const token = tokenInfo[1];

        setData({ user, token });

        api.defaults.headers.authorization = `Bearer ${token}`;
      }

      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });

    const { user, token } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:user', JSON.stringify(user)],
      ['@GoBarber:token', token],
    ]);

    setData({ user, token });

    api.defaults.headers.authorization = `Bearer ${token}`;
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}
