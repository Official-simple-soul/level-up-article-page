import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import useNewAuth from './server/useNewAuth';
import IsAuthorizedRequestStatus from './types/IsAuthorizedRequestStatus';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  //const { isAuthorized } = useAuth();
  const isAuthorized = useNewAuth();
  const location = useLocation();

  console.log('isAuthorized', isAuthorized);

  if (isAuthorized === IsAuthorizedRequestStatus.UNKNOWN) {
    return <div>Loading...</div>;
  } else if (isAuthorized === IsAuthorizedRequestStatus.NOT_AUTHORIZED) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
