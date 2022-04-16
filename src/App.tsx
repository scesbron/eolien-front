import React, { ChangeEvent, useCallback } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';

import PrivateRoute from './routes/private-route';
import Login from './screens/login';
import Home from './screens/home';
import ForgottenPassword from './screens/forgotten-password';
import { FORGOTTEN_PASSWORD, LOGIN, NEW_PASSWORD } from './constants/routes';
import NewPassword from './screens/new-password';
import useAuth from './containers/auth';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigateTo = useCallback(
    (event: ChangeEvent<{}>, newValue: string) => {
      if (newValue === 'logout') {
        logout();
      } else {
        navigate(pathFromValue(newValue));
      }
    },
    [navigate, logout],
  );

  return (
    <div className={classes.container}>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={FORGOTTEN_PASSWORD} element={<ForgottenPassword />} />
        <Route path={NEW_PASSWORD} element={<NewPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path='/*' element={<Home />} />
        </Route>
      </Routes>
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
