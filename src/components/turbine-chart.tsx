import Chart from 'react-apexcharts';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

type TurbineProps = {
  name: string;
  power: number;
  windSpeed: number;
  maxPower: number;
};

const StyledTurbine = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartContainer = styled.div`
  width: 250px;
  height: 170px;
`;

const TurbineChart = ({ name, power, windSpeed, maxPower }: TurbineProps) => (
  <StyledTurbine key={name}>
    <ChartContainer>
      <Chart
        options={{
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 135,
              hollow: {
                margin: 0,
                size: '70%',
              },
              dataLabels: {
                name: {
                  show: true,
                  color: '#388e3c',
                  fontSize: '1rem',
                },
                value: {
                  show: true,
                  color: '#81c784',
                  fontSize: '1rem',
                  formatter: (val) => `${(Math.floor(val) * maxPower) / 100} kW`,
                },
              },
            },
          },
          fill: {
            colors: ['#388e3c'],
          },
          stroke: {
            lineCap: 'round',
          },
          labels: [name],
        }}
        series={[(power / maxPower) * 100]}
        type='radialBar'
        width='250'
      />
    </ChartContainer>
    <Typography>{`Vent : ${windSpeed ? windSpeed.toFixed(2) : '?'} m/s`}</Typography>
  </StyledTurbine>
);

export default TurbineChart;
