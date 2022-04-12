import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import {
  subYears,
  addYears,
  subDays,
  addDays,
  min,
  max,
  isEqual,
  startOfMonth,
  startOfYear,
} from 'date-fns';

import { Init, InitState, RootState, YearlyDataState } from '../types';
import * as duck from '../ducks/wind-farm';
import { format } from '../utils/date';
import Loader from '../components/loader';
import YearlyChart from '../components/yearly-chart';

const StyledContainer = styled(Container)`
  margin-top: 1rem;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(Typography)`
  padding: 1rem 0;
`;

const maxValue = (init: Init) => subDays(startOfMonth(init.maxDate), 1);

const sum = (values: number[]) => {
  let acc = 0;
  return values.map((value) => {
    acc += value / 1000;
    return acc;
  });
};

type Year = {
  startDate: Date;
  endDate: Date;
};

type YearlyDataProps = {
  init: InitState;
  yearlyData: YearlyDataState;
  getYearlyData: (startDate: Date, endDate: Date) => void;
};

const YearlyData = ({ init, yearlyData, getYearlyData }: YearlyDataProps) => {
  const [year, setYear] = useState<Year>();

  useEffect(() => {
    if (init.success && init.value) {
      const endDate = maxValue(init.value);
      setYear({
        startDate: max([init.value.minDate, startOfYear(endDate)]),
        endDate,
      });
    }
  }, [init]);

  useEffect(() => {
    if (year) getYearlyData(year.startDate, year.endDate);
  }, [getYearlyData, year]);

  const onPrevious = useCallback(() => {
    setYear((previous) => {
      if (init.value && previous) {
        return {
          startDate: max([init.value.minDate, subYears(previous.startDate, 1)]),
          endDate: subDays(previous.startDate, 1),
        };
      }
      return previous;
    });
  }, [init]);

  const onNext = useCallback(() => {
    setYear((previous) => {
      if (init.value && previous) {
        return {
          startDate: addDays(previous.endDate, 1),
          endDate: min([addYears(previous.endDate, 1), maxValue(init.value)]),
        };
      }
      return previous;
    });
  }, [init]);

  if (!year || !init.value) return null;

  const lastYear = isEqual(maxValue(init.value), year.endDate);
  const firstYear = init.value.minDate.getFullYear() === year.startDate.getFullYear();

  return (
    <StyledContainer disableGutters>
      <Header>
        <IconButton onClick={onPrevious} disabled={firstYear}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant='h5'>{format(year.startDate, 'yyyy')}</Typography>
        <IconButton onClick={onNext} disabled={lastYear}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Header>
      {yearlyData.onGoing && <Loader />}
      {yearlyData.errors.length > 0 && <Title variant='h4'>Erreur de connexion au parc</Title>}
      {yearlyData.success && yearlyData.value && (
        <>
          <Title variant='h6'>Production par mois (MWh)</Title>
          <YearlyChart
            labels={yearlyData.value.labels}
            values={yearlyData.value.values.map((value) => value / 1000)}
            goals={yearlyData.value.goals.map((value) => value / 1000)}
          />
          <Title variant='h6'>Cumul de production (MWh)</Title>
          <YearlyChart
            labels={yearlyData.value.labels}
            values={sum(yearlyData.value.values)}
            goals={sum(yearlyData.value.goals)}
          />
        </>
      )}
    </StyledContainer>
  );
};

const mapStateToProps = (state: RootState) => ({
  init: state.windFarm.init,
  yearlyData: state.windFarm.yearlyData,
});

const mapDispatchToProps = {
  getYearlyData: duck.getYearlyData,
};

export default connect(mapStateToProps, mapDispatchToProps)(YearlyData);
