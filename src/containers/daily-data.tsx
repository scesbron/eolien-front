import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { parse, isSameDay, isToday, subDays, addDays, isValid, isFuture } from 'date-fns';

import { format } from '../utils/date';
import * as duck from '../ducks/wind-farm';
import Loader from '../components/loader';
import { DailyDataState, InitState, RootState } from '../types';
import DailyChart from '../components/daily-chart';

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

type DailyDataProps = {
  init: InitState;
  dailyData: DailyDataState;
  getDailyData: (day: Date) => void;
};

const DailyData = ({ init, dailyData, getDailyData }: DailyDataProps) => {
  const [day, setDay] = useState(new Date());

  const onPrevious = useCallback(() => setDay(subDays(day, 1)), [day]);
  const onNext = useCallback(() => setDay(addDays(day, 1)), [day]);
  const onDateChange = useCallback((event) => {
    const newDay = parse(event.target.value, 'yyyy-MM-dd', new Date());
    setDay(isFuture(newDay) ? new Date() : newDay);
  }, []);

  useEffect(() => {
    if (init.success && isValid(day)) {
      getDailyData(day);
    }
  }, [init.success, getDailyData, day]);

  if (!init.success || !init.value) return null;

  const { turbinePower } = init.value;
  const lastDay = isToday(day);
  const firstDay = isSameDay(day, init.value.minDate);

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
            min: format(init.value.minDate, 'yyyy-MM-dd'),
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
      {dailyData.onGoing && <Loader />}
      {!isValid(day) && <Title variant='h4'>Sélectionnez une date</Title>}
      {dailyData.errors.length > 0 && <Title variant='h4'>Erreur de connexion au parc</Title>}
      {dailyData.success && isValid(day) && dailyData.value && (
        <>
          <Title>Production moyenne (kW) toutes les 10 min</Title>
          <div>
            <Typography variant='h4'>Parc</Typography>
            <DailyChart
              labels={dailyData.value[0].labels}
              max={dailyData.value.length * turbinePower}
              data={sumArrays(dailyData.value.map((turbineData) => turbineData.power))}
            />
          </div>
          {dailyData.value.map((turbineData) => (
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

const mapStateToProps = (state: RootState) => ({
  init: state.windFarm.init,
  dailyData: state.windFarm.dailyData,
});

const mapDispatchToProps = {
  getDailyData: duck.getDailyData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyData);
