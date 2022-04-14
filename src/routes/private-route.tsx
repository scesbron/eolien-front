import React, { PropsWithChildren } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { LOGIN } from '../constants/routes';
import useAuth from '../hooks/use-auth';

type PrivateRouteProps = PropsWithChildren<{
  path: string;
}>;

const PrivateRoute = ({ children, path }: PrivateRouteProps) => {
  const { user } = useAuth();
  return (
    <Route
      path={path}
      render={({ location }) =>
        user ? children : <Redirect to={{ pathname: LOGIN, state: { from: location } }} />
      }
    />
  );
};

export default PrivateRoute;
