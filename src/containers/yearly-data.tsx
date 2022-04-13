import React, { useCallback, useEffect, useState } from 'react';
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

import { format } from '../utils/date';
import Loader from '../components/loader';
import YearlyChart from '../components/yearly-chart';
import useYearlyData from '../queries/use-yearly-data';
import useConfig from '../queries/use-config';
import { Config } from '../types';

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

const maxValue = (config: Config) => subDays(startOfMonth(config.maxDate), 1);

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

const YearlyData = () => {
  const [year, setYear] = useState<Year>();
  const { data: config } = useConfig();
  const { data: yearlyData, isLoading, error } = useYearlyData(year?.startDate, year?.endDate);

  useEffect(() => {
    if (config) {
      const endDate = maxValue(config);
      setYear({
        startDate: max([config.minDate, startOfYear(endDate)]),
        endDate,
      });
    }
  }, [config]);

  const onPrevious = useCallback(() => {
    setYear((previous) => {
      if (config && previous) {
        return {
          startDate: max([config.minDate, subYears(previous.startDate, 1)]),
          endDate: subDays(previous.startDate, 1),
        };
      }
      return previous;
    });
  }, [config]);

  const onNext = useCallback(() => {
    setYear((previous) => {
      if (config && previous) {
        return {
          startDate: addDays(previous.endDate, 1),
          endDate: min([addYears(previous.endDate, 1), maxValue(config)]),
        };
      }
      return previous;
    });
  }, [config]);

  if (!year || !config) return null;

  const lastYear = isEqual(maxValue(config), year.endDate);
  const firstYear = config.minDate.getFullYear() === year.startDate.getFullYear();

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
      {isLoading && <Loader />}
      {!!error && <Title variant='h4'>Erreur de connexion au parc</Title>}
      {yearlyData && (
        <>
          <Title variant='h6'>Production par mois (MWh)</Title>
          <YearlyChart
            labels={yearlyData.labels}
            values={yearlyData.values.map((value) => value / 1000)}
            goals={yearlyData.goals.map((value) => value / 1000)}
          />
          <Title variant='h6'>Cumul de production (MWh)</Title>
          <YearlyChart
            labels={yearlyData.labels}
            values={sum(yearlyData.values)}
            goals={sum(yearlyData.goals)}
          />
        </>
      )}
    </StyledContainer>
  );
};

export default YearlyData;
