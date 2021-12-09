import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userType } from '../types';
import { LOGIN } from '../constants/routes';

const PrivateRoute = ({ children, path, user }) => (
  <Route
    path={path}
    render={({ location }) => (
      user ? (
        children
      ) : (
        <Redirect to={{ pathname: LOGIN, state: { from: location } }} />
      )
    )}
  />
);

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  user: userType,
};

PrivateRoute.defaultProps = {
  user: undefined,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

export default connect(mapStateToProps, null)(PrivateRoute);
