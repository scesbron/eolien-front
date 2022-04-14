import { useQuery } from 'react-query';
import { windFarm } from '../api';
import { parseApiDate } from '../utils/date';
import { ApiInit, Config } from '../types';

const getConfig = async (): Promise<ApiInit> => {
  const response = await windFarm.initialize();
  return response.data;
};

const transformDates = (data: ApiInit): Config => ({
  ...data,
  minDate: parseApiDate(data.minDate),
  maxDate: parseApiDate(data.maxDate),
});

const useConfig = () =>
  useQuery(['config'], getConfig, {
    select: transformDates,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

export default useConfig;
