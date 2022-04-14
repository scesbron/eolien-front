import React, { useCallback } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';

import PrivateRoute from './routes/private-route';
import Login from './containers/login';
import Home from './containers/home';
import ForgottenPassword from './containers/forgotten-password';
import { FORGOTTEN_PASSWORD, LOGIN, NEW_PASSWORD } from './constants/routes';
import NewPassword from './containers/new-password';
import useAuth from './hooks/use-auth';

const navigationRoutes = [
  { path: '/', value: 'home' },
  { path: '/logout', value: 'logout' },
];

const useStyles = makeStyles({
  container: {
    minHeight: '100%',
    marginTop: '-16px',
    paddingTop: '16px',
  },
  navigation: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

const valueFromPath = (path: string) =>
  (navigationRoutes.find((route) => route.path === path) || { value: 'home' }).value;

const pathFromValue = (value: string) =>
  navigationRoutes.find((route) => route?.value === value)?.path || navigationRoutes[0].path;

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigateTo = useCallback(
    (event, newValue) => {
      if (newValue === 'logout') {
        logout();
      } else {
        history.push(pathFromValue(newValue));
      }
    },
    [history, logout],
  );

  return (
    <div className={classes.container}>
      <Switch>
        <Route path={LOGIN}>
          <Login />
        </Route>
        <Route path={FORGOTTEN_PASSWORD}>
          <ForgottenPassword />
        </Route>
        <Route path={NEW_PASSWORD}>
          <NewPassword />
        </Route>
        <PrivateRoute path='/'>
          <Home />
        </PrivateRoute>
      </Switch>
      {user && (
        <BottomNavigation
          value={valueFromPath(location.pathname)}
          onChange={navigateTo}
          showLabels
          className={classes.navigation}
        >
          <BottomNavigationAction label='Production' value='home' icon={<BarChartIcon />} />
          <BottomNavigationAction label='Déconnexion' value='logout' icon={<ExitToAppIcon />} />
        </BottomNavigation>
      )}
    </div>
  );
};

export default App;
