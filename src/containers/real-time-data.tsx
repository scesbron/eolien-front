import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

import { Status } from '../types';
import Loader from '../components/loader';
import TurbineChart from '../components/turbine-chart';
import useConfig from '../queries/use-config';
import useStatus from '../queries/use-status';

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

const RealTimeData = () => {
  const { data: config } = useConfig();
  const { data: status, error } = useStatus(config?.sessionId, config?.handle);

  if (error) {
    return (
      <StyledContainer>
        <Title variant='h4'>Erreur de connexion au parc</Title>
      </StyledContainer>
    );
  }

  if (!status || !config) {
    return (
      <StyledContainer>
        <Title variant='h4'>Chargement des données</Title>
        <Loader />
      </StyledContainer>
    );
  }

  const { turbinePower } = config;

  return (
    <StyledContainer disableGutters>
      <Typography>Production instantanée en kW</Typography>
      <Farm>
        <TurbineChart
          name='Parc'
          power={sum(status, 'instantPower')}
          maxPower={turbinePower * status.length}
          windSpeed={avg(status, 'windSpeed')}
        />
      </Farm>
      <Farm>
        {status.map((turbine) => (
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
export default RealTimeData;
