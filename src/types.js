import {
  arrayOf, number, shape, string, bool,
} from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const userType = shape({
  firstName: string,
  lastName: string,
  email: string,
  username: string,
});

export const windTurbineStatusType = shape({
  name: string,
  instantPower: number,
  windSpeed: number,
  disponibility: number,
  totalProduction: number,
});

export const initType = shape({
  sessionId: string,
  handle: string,
});

export const monthlyDataType = shape({
  productibles: arrayOf(shape({
    name: string,
    value: number,
  })),
  labels: arrayOf(string),
  values: arrayOf(number),
  goals: arrayOf(number),
  ratio: number,
  production: number,
});

export const dailyDataType = arrayOf(
  shape({
    name: string,
    labels: arrayOf(string),
    power: arrayOf(number),
    windSpeed: arrayOf(number),
  }),
);

export const yearlyDataType = shape({
  labels: arrayOf(string),
  values: arrayOf(number),
  goals: arrayOf(number),
});

export const requestType = (mainType) => shape({
  onGoing: bool,
  success: bool,
  errors: arrayOf(string),
  value: mainType,
});
