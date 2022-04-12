import React, { PropsWithChildren } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState, User } from '../types';
import { LOGIN } from '../constants/routes';

type PrivateRouteProps = PropsWithChildren<{
  path: string;
  user?: User;
}>;

const PrivateRoute = ({ children, path, user }: PrivateRouteProps) => (
  <Route
    path={path}
    render={({ location }) =>
      user ? children : <Redirect to={{ pathname: LOGIN, state: { from: location } }} />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  user: state.user.current,
});

export default connect(mapStateToProps, null)(PrivateRoute);
