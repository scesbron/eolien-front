import Chart from 'react-apexcharts';
import React from 'react';

type DailyChartProps = {
  labels: string[];
  max: number;
  data: number[];
};

const DailyChart = ({ labels, max, data }: DailyChartProps) => (
  <Chart
    options={{
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        min: 0,
        max,
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
        data,
      },
    ]}
    type='line'
    height='300px'
  />
);

export default DailyChart;
