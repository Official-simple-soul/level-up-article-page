import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login, register } from 'utils/axios';
import LoginForm from '../types/LoginForm';
import ApiUser from 'types/ApiUser';
import RegisterUser from 'types/RegisterUser';
import { showNotification } from '@mantine/notifications';

interface AuthContextType {
  isAuthorized: IsAuthorizedRequestStatus;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterUser) => Promise<void>;
  logout: () => void;
  user: ApiUser | null;
}

export enum IsAuthorizedRequestStatus {
  UNKNOWN = 'unknown',
  AUTHORIZED = 1,
  NOT_AUTHORIZED = 0
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthorized, setIsAuthorized] = useState(
    IsAuthorizedRequestStatus.UNKNOWN
  );
  const [user, setUser] = useState<ApiUser | null>(null);

  const fetchMe = async () => {
    try {
      const data = await getMe();
      setUser(data);
      setIsAuthorized(IsAuthorizedRequestStatus.AUTHORIZED);
    } catch (error) {
      setUser(null);
      setIsAuthorized(IsAuthorizedRequestStatus.NOT_AUTHORIZED);
    }
  };

  const fetchLogin = async (data: LoginForm) => {
    try {
      const response = await login(data);
      console.log('awaited response received', response);

      localStorage.setItem('token', response.token);
      setIsAuthorized(IsAuthorizedRequestStatus.AUTHORIZED);
      await fetchMe();
    } catch (error) {
      console.error('Error logging in', error);
      setIsAuthorized(IsAuthorizedRequestStatus.NOT_AUTHORIZED);
    }
  };

  const fetchRegister = async (data: FormData) => {
    try {
      await register(data);
      showNotification({
        title: 'Registration Successful',
        message: 'You have registered successfully! Please login.',
        color: 'green',
      });

    } catch (error) {
      console.error('Error registering', error);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = () => {
    const sendLogoutRequest = async () => {
      try {
        // TODO - not implemented on the backend
        /*         await axios({
          method: 'POST',
          url: '/api/logout'
        }); */

        setUser(null);
        window.location.href = '/';
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Error logging out', error);
      } finally {
        setIsAuthorized(IsAuthorizedRequestStatus.NOT_AUTHORIZED);
      }
    };

    sendLogoutRequest();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthorized, login: fetchLogin, logout, user, register: fetchRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
