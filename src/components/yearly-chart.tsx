import Chart from 'react-apexcharts';
import React from 'react';

type YearlyChartProps = {
  labels: string[];
  values: number[];
  goals: number[];
};

const YearlyChart = ({ labels, values, goals }: YearlyChartProps) => (
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
          formatter: (value) => String(Math.floor(value)),
        },
      },
      stroke: {
        curve: 'smooth',
      },
    }}
    series={[
      {
        name: 'Production',
        data: values,
      },
      {
        name: 'Objectif',
        data: goals,
      },
    ]}
    type='line'
    height='300px'
  />
);

export default YearlyChart;
