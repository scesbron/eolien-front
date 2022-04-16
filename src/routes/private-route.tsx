import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LOGIN } from '../constants/routes';
import useAuth from '../containers/auth';

const PrivateRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={LOGIN} state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
