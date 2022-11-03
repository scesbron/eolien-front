import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { CustomLocation, LoginProps, User } from '../types';
import { user as userApi, session } from '../api';
import { getErrors } from '../queries/utils';

const AUTH_KEY = 'EOLIEN-TOKEN';

type AuthContextType = {
  user?: User;
  login: ({ username, password, rememberMe }: LoginProps) => void;
  logout: () => void;
  isLoading: boolean;
  errors: string[];
};

const setAuthorization = (authorization?: string, rememberMe?: boolean) => {
  if (axios.defaults.headers) {
    axios.defaults.headers.common.Authorization = authorization || '';
  }

  if (authorization) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, authorization);
  } else {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }
};

const initAuthorization = () => {
  if (axios.defaults.headers) {
    axios.defaults.headers.common.Authorization =
      localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || '';
  }
};

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  errors: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: ({ username, password, rememberMe }: LoginProps) => {},
  logout: () => {},
});

export const AuthProvider = ({
  initialize = true,
  children,
}: PropsWithChildren<{ initialize: boolean }>) => {
  const [user, setUser] = useState<User>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(!initialize);
  const navigate = useNavigate();
  const location = useLocation();

  // If we change page, reset the error state.
  useEffect(() => {
    if (errors.length > 0) setErrors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (initialize) {
      initAuthorization();
      userApi
        .get()
        .then((response) => setUser(response.data))
        .catch(() => setAuthorization())
        .finally(() => setIsInitialized(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAuthentication = useCallback(() => {
    const from = (location as CustomLocation).state?.from || '/';
    navigate(from, { replace: true });
  }, [navigate, location]);

  const login = useCallback(
    async ({ username, password, rememberMe }: LoginProps) => {
      setIsLoading(true);
      try {
        const response = await session.create(username, password);
        setAuthorization(response.headers.authorization, rememberMe);
        setUser(response.data);
        onAuthentication();
      } catch (error) {
        const value = getErrors(error);
        setErrors(value);
        setAuthorization();
      } finally {
        setIsLoading(false);
      }
    },
    [onAuthentication],
  );

  const logout = useCallback(async () => {
    await session.delete();
    setAuthorization();
    setUser(undefined);
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      isLoading,
      errors,
      login,
      logout,
    }),
    [user, isLoading, errors, login, logout],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{isInitialized && children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
