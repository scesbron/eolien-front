import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import {
  useLocation, Link, Switch, Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import RealTimeData from './real-time-data';
import MonthlyData from './monthly-data';
import YearlyData from './yearly-data';
import {
  DAILY_DATA, MONTHLY_DATA, REAL_TIME_DATA, YEARLY_DATA,
} from '../constants/routes';
import { initType, requestType } from '../types';
import * as duck from '../ducks/wind-farm';
import Loader from '../components/loader';
import DailyData from './daily-data';

const StyledContainer = styled(Container)`
  text-align: center;
  padding-bottom: 72px;
`;

const StyledBar = styled(AppBar)`
  box-shadow: none;
`;

const Title = styled(Typography)`
  margin: 1rem 0;
`;

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const Home = ({ init, initialize }) => {
  const location = useLocation();

  useEffect(() => {
    if (!init.onGoing && !init.errors.length && !init.success) {
      initialize();
    }
  }, [init.onGoing, init.errors.length, init.success, initialize]);

  if (init.onGoing) {
    return (
      <StyledContainer>
        <Title variant="h4">Connexion au parc</Title>
        <Loader />
      </StyledContainer>
    );
  }

  if (init.errors.length) {
    return (
      <StyledContainer>
        <Title variant="h4">Erreur de connexion au parc</Title>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer disableGutters>
      <StyledBar position="static" color="transparent">
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          value={location.pathname}
          aria-label="Visualisation des données du parc"
        >
          <Tab label="Actuel" {...a11yProps(0)} value={REAL_TIME_DATA} component={Link} to={REAL_TIME_DATA} />
          <Tab label="Quotidien" {...a11yProps(1)} value={DAILY_DATA} component={Link} to={DAILY_DATA} />
          <Tab label="Mensuel" {...a11yProps(1)} value={MONTHLY_DATA} component={Link} to={MONTHLY_DATA} />
          <Tab label="Annuel" {...a11yProps(2)} value={YEARLY_DATA} component={Link} to={YEARLY_DATA} />
        </Tabs>
      </StyledBar>
      <Switch>
        <Route path={DAILY_DATA}>
          <DailyData />
        </Route>
        <Route path={MONTHLY_DATA}>
          <MonthlyData />
        </Route>
        <Route path={YEARLY_DATA}>
          <YearlyData />
        </Route>
        <Route path={REAL_TIME_DATA}>
          <RealTimeData />
        </Route>
      </Switch>
    </StyledContainer>
  );
};

Home.propTypes = {
  init: requestType(initType).isRequired,
  initialize: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  init: state.windFarm.init,
});

const mapDispatchToProps = {
  initialize: duck.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
