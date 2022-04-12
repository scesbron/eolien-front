import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

import { InitState, RootState, Status, StatusState } from '../types';
import * as duck from '../ducks/wind-farm';
import Loader from '../components/loader';
import TurbineChart from '../components/turbine-chart';

const Farm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledContainer = styled(Container)`
  margin-top: 1rem;
  text-align: center;
`;

const Title = styled(Typography)`
  padding: 1rem 0;
`;

const sum = (array: Status, value: 'instantPower' | 'windSpeed') =>
  array.reduce((acc, item) => acc + (item[value] || 0), 0);
const avg = (array: Status, value: 'instantPower' | 'windSpeed') =>
  sum(array, value) / array.length;

type RealTimeDataProps = {
  init: InitState;
  status: StatusState;
  initialize: () => void;
  getStatus: () => void;
};

const RealTimeData = ({ init, status, initialize, getStatus }: RealTimeDataProps) => {
  useEffect(() => {
    if (status.errors.length) {
      initialize();
    }
  }, [status.errors.length, initialize]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (init.success) {
      getStatus();
      interval = setInterval(getStatus, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init.success]);

  if (status.onGoing && !status.value) {
    return (
      <StyledContainer>
        <Title variant='h4'>Chargement des données</Title>
        <Loader />
      </StyledContainer>
    );
  }

  if (status.errors.length) {
    return (
      <StyledContainer>
        <Title variant='h4'>Erreur de connexion au parc</Title>
      </StyledContainer>
    );
  }
  if (!status.value || !init.value) return null;

  const { turbinePower } = init.value;

  return (
    <StyledContainer disableGutters>
      <Typography>Production instantanée en kW</Typography>
      <Farm>
        <TurbineChart
          name='Parc'
          power={sum(status.value, 'instantPower')}
          maxPower={turbinePower * status.value.length}
          windSpeed={avg(status.value, 'windSpeed')}
        />
      </Farm>
      <Farm>
        {status.value.map((turbine) => (
          <TurbineChart
            key={turbine.name}
            name={turbine.name}
            power={turbine.instantPower || 0}
            windSpeed={turbine.windSpeed || 0}
            maxPower={turbinePower}
          />
        ))}
      </Farm>
    </StyledContainer>
  );
};

const mapStateToProps = (state: RootState) => ({
  init: state.windFarm.init,
  status: state.windFarm.status,
});

const mapDispatchToProps = {
  initialize: duck.initialize,
  getStatus: duck.getStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeData);
