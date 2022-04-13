import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { parse, isSameDay, isToday, subDays, addDays, isValid, isFuture } from 'date-fns';

import { format } from '../utils/date';
import Loader from '../components/loader';
import DailyChart from '../components/daily-chart';
import useConfig from '../queries/use-config';
import useDailyData from '../queries/use-daily-data';

const StyledContainer = styled(Container)`
  margin-top: 1rem;
  text-align: center;
`;

const Title = styled(Typography)`
  padding: 1rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
`;

const sumArrays = (arrays: number[][]) => {
  const nbArrays = arrays.length;
  if (nbArrays > 0 && arrays[0]) {
    return arrays[0].map((value, index) => {
      let sum = value;
      for (let cpt = 1; cpt < nbArrays; cpt += 1) {
        sum += arrays[cpt][index];
      }
      return sum;
    });
  }
  return [];
};

const DailyData = () => {
  const [day, setDay] = useState(new Date());
  const { data: config } = useConfig();
  const { data: dailyData, error } = useDailyData(day, config?.sessionId);

  const onPrevious = useCallback(() => setDay(subDays(day, 1)), [day]);
  const onNext = useCallback(() => setDay(addDays(day, 1)), [day]);
  const onDateChange = useCallback((event) => {
    const newDay = parse(event.target.value, 'yyyy-MM-dd', new Date());
    setDay(isFuture(newDay) ? new Date() : newDay);
  }, []);

  if (!config) return null;

  const { turbinePower } = config;
  const lastDay = isToday(day);
  const firstDay = isSameDay(day, config.minDate);

  return (
    <StyledContainer disableGutters>
      <Header>
        <IconButton onClick={onPrevious} disabled={firstDay}>
          <ArrowBackIosIcon />
        </IconButton>
        <TextField
          id='date'
          label='Date'
          type='date'
          value={isValid(day) ? format(day, 'yyyy-MM-dd') : ''}
          inputProps={{
            min: format(config.minDate, 'yyyy-MM-dd'),
            max: format(new Date(), 'yyyy-MM-dd'),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={onDateChange}
        />
        <IconButton onClick={onNext} disabled={lastDay}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Header>
      {!dailyData && <Loader />}
      {!isValid(day) && <Title variant='h4'>Sélectionnez une date</Title>}
      {!!error && <Title variant='h4'>Erreur de connexion au parc</Title>}
      {!!dailyData && (
        <>
          <Title>Production moyenne (kW) toutes les 10 min</Title>
          <div>
            <Typography variant='h4'>Parc</Typography>
            <DailyChart
              labels={dailyData[0].labels}
              max={dailyData.length * turbinePower}
              data={sumArrays(dailyData.map((turbineData) => turbineData.power))}
            />
          </div>
          {dailyData.map((turbineData) => (
            <div key={turbineData.name}>
              <Typography variant='h5'>{turbineData.name}</Typography>
              <DailyChart labels={turbineData.labels} max={turbinePower} data={turbineData.power} />
            </div>
          ))}
        </>
      )}
    </StyledContainer>
  );
};

export default DailyData;
