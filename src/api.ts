import axios from 'axios';
import { format } from 'date-fns';

import { API_BASE_URL } from './config';

const AUTH_KEY = 'EOLIEN-TOKEN';
const DATE_FORMAT = 'yyyy-MM-dd';

export const user = {
  get: () => axios.get(`${API_BASE_URL}/user`),
};

export const session = {
  create: (username: string, password: string) =>
    axios.post(`${API_BASE_URL}/login`, { user: { username, password } }),
  delete: () => axios.delete(`${API_BASE_URL}/logout`),
};

export const password = {
  create: (username: string) => axios.post(`${API_BASE_URL}/password`, { user: { username } }),
  update: (token: string | null, newPassword: string, passwordConfirmation: string) =>
    axios.patch(`${API_BASE_URL}/password`, {
      user: {
        reset_password_token: token,
        password: newPassword,
        password_confirmation: passwordConfirmation,
      },
    }),
};

export const windFarm = {
  initialize: () => axios.get(`${API_BASE_URL}/wind_farm/init`),
  status: (sessionId: string, handle: string) =>
    axios.get(`${API_BASE_URL}/wind_farm/status`, { params: { sessionId, handle } }),
  monthlyData: (day: Date) =>
    axios.get(`${API_BASE_URL}/wind_farm/monthly_data`, {
      params: { day: format(day, DATE_FORMAT) },
    }),
  dailyData: (sessionId: string, day: Date) =>
    axios.get(`${API_BASE_URL}/wind_farm/daily_data`, {
      params: { sessionId, day: format(day, DATE_FORMAT) },
    }),
  yearlyData: (startDate: Date, endDate: Date) =>
    axios.get(`${API_BASE_URL}/wind_farm/yearly_data`, {
      params: {
        startDate: format(startDate, DATE_FORMAT),
        endDate: format(endDate, DATE_FORMAT),
      },
    }),
};

export const setAuthorization = (authorization?: string, rememberMe?: boolean) => {
  if (axios.defaults.headers && authorization) {
    axios.defaults.headers.common.Authorization = authorization;
  }
  if (authorization) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, authorization);
  }
};

export const initAuthorization = () => {
  if (axios.defaults.headers) {
    axios.defaults.headers.common.Authorization =
      localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || '';
  }
};
