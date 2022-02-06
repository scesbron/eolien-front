import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Chart from 'react-apexcharts';
import {
  subYears, addYears, subDays, addDays, min, max, isEqual, startOfMonth, startOfYear,
} from 'date-fns';

import { initType, requestType, yearlyDataType } from '../types';
import * as duck from '../ducks/wind-farm';
import { format } from '../utils/date';
import Loader from '../components/loader';

const StyledContainer = styled(Container)`
  margin-top: 1rem;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between
`;

const Title = styled(Typography)`
  padding: 1rem 0;
`;

const maxValue = (init) => subDays(startOfMonth(init.value.maxDate), 1);

const sum = (values) => {
  let acc = 0;
  return values.map((value) => {
    acc += (value / 1000);
    return acc;
  });
};

const YearlyChart = ({ labels, values, goals }) => (
  <Chart
    options={{
      markers: {
        size: 4,
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (value) => parseInt(value, 10),
        },
      },
      stroke: {
        curve: 'smooth',
      },
    }}
    series={[{
      name: 'Production',
      data: values,
    }, {
      name: 'Objectif',
      data: goals,
    }]}
    type="line"
    height="300px"
  />
);

YearlyChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  goals: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const YearlyData = ({ init, yearlyData, getYearlyData }) => {
  const [year, setYear] = useState();

  useEffect(() => {
    if (init.success) {
      const endDate = maxValue(init);
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
    setYear((previous) => ({
      startDate: max([init.value.minDate, subYears(previous.startDate, 1)]),
      endDate: subDays(previous.startDate, 1),
    }));
  }, [init]);

  const onNext = useCallback(() => {
    setYear((previous) => ({
      startDate: addDays(previous.endDate, 1),
      endDate: min([addYears(previous.endDate, 1), maxValue(init)]),
    }));
  }, [init]);

  if (!year) return null;

  const lastYear = isEqual(maxValue(init), year.endDate);
  const firstYear = init.value.minDate.getYear() === year.startDate.getYear();

  return (
    <StyledContainer disableGutters>
      <Header>
        <IconButton onClick={onPrevious} disabled={firstYear}><ArrowBackIosIcon /></IconButton>
        <Typography variant="h5">{format(year.startDate, 'yyyy')}</Typography>
        <IconButton onClick={onNext} disabled={lastYear}><ArrowForwardIosIcon /></IconButton>
      </Header>
      {yearlyData.onGoing && (<Loader />)}
      {yearlyData.errors.length > 0 && (
        <Title variant="h4">Erreur de connexion au parc</Title>
      )}
      {yearlyData.success && (
        <>
          <Title variant="h6">Production par mois (MWh)</Title>
          <YearlyChart
            labels={yearlyData.value.labels}
            values={yearlyData.value.values.map((value) => value / 1000)}
            goals={yearlyData.value.goals.map((value) => value / 1000)}
          />
          <Title variant="h6">Cumul de production (MWh)</Title>
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

YearlyData.propTypes = {
  init: requestType(initType).isRequired,
  yearlyData: requestType(yearlyDataType).isRequired,
  getYearlyData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  init: state.windFarm.init,
  yearlyData: state.windFarm.yearlyData,
});

const mapDispatchToProps = {
  getYearlyData: duck.getYearlyData,
};

export default connect(mapStateToProps, mapDispatchToProps)(YearlyData);
