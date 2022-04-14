import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { addMonths, subMonths, isSameMonth } from 'date-fns';
import Chart from 'react-apexcharts';

import { format } from '../utils/date';
import Loader from '../components/loader';
import { minWidth } from '../styles/mixins';
import useMonthlyData from '../queries/use-monthly-data';
import useConfig from '../queries/use-config';

const StyledContainer = styled(Container)`
  margin-top: 1rem;
  text-align: center;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${minWidth.md`
    flex-direction: row;
  `}
`;

const ChartContainer = styled.div`
  flex: 1;
`;

const Production = styled.div`
  padding: 0 1rem;
`;

const ProductionLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(Typography)`
  margin: 1rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MonthlyData = () => {
  const [month, setMonth] = useState<Date>();
  const { data: config } = useConfig();
  const { data: monthlyData, isLoading, error } = useMonthlyData(month);

  useEffect(() => {
    if (config) setMonth(config.maxDate);
  }, [config]);

  const onPrevious = useCallback(() => {
    if (month) setMonth(subMonths(month, 1));
  }, [month]);

  const onNext = useCallback(() => {
    if (month) setMonth(addMonths(month, 1));
  }, [month]);

  if (!config) return null;

  const lastMonth = !month || isSameMonth(month, config.maxDate);
  const firstMonth = !month || isSameMonth(month, config.minDate);

  return (
    <StyledContainer disableGutters>
      <>
        <Header>
          <IconButton onClick={onPrevious} disabled={firstMonth}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant='h4'>{month ? format(month, 'MMMM') : ''}</Typography>
          <IconButton onClick={onNext} disabled={lastMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Header>
        {isLoading && <Loader />}
        {error && <Title variant='h4'>Erreur de connexion au parc</Title>}
        {monthlyData && (
          <div>
            <Title>Production jour par jour en kWh</Title>
            <DataContainer>
              <ChartContainer>
                <Chart
                  options={{
                    stroke: {
                      width: [0, 2],
                      curve: 'smooth',
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    xaxis: {
                      categories: monthlyData.labels,
                    },
                    yaxis: {
                      min: 0,
                      max: (config.turbinePower * config.turbineCount * 24) / 1000,
                      decimalsInFloat: 0,
                    },
                  }}
                  series={[
                    {
                      name: 'Production',
                      type: 'bar',
                      data: monthlyData.values.map((value) => value / 1000),
                    },
                    {
                      name: monthlyData.productibles[0].name,
                      type: 'line',
                      data: monthlyData.goals.map((value) => value / 1000),
                    },
                  ]}
                  type='line'
                />
              </ChartContainer>
              <Production>
                <Title variant='h5'>Pour le mois</Title>
                <ProductionLine>
                  <Title variant='h6'>Production&nbsp;</Title>
                  <Title variant='h6'>{`${Math.round(
                    monthlyData.production / 1000,
                  )}\u00a0MWh`}</Title>
                </ProductionLine>
                {monthlyData.productibles.map((productible) => (
                  <ProductionLine key={productible.name}>
                    <Title variant='h6'>{`${productible.name}\u00a0`}</Title>
                    <Title variant='h6'>
                      {`${Math.round(
                        (productible.value * (monthlyData?.ratio ?? 1)) / 1000,
                      )}\u00a0MWh`}
                    </Title>
                  </ProductionLine>
                ))}
              </Production>
            </DataContainer>
          </div>
        )}
      </>
    </StyledContainer>
  );
};

export default MonthlyData;
