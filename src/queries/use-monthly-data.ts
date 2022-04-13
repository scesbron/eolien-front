import { QueryFunctionContext, useQuery } from 'react-query';
import { windFarm } from '../api';
import { MonthlyData } from '../types';

const getMonthlyData = async ({
  queryKey,
}: QueryFunctionContext<[string, Date | undefined]>): Promise<MonthlyData> => {
  const [, month] = queryKey;
  const response = await windFarm.monthlyData(month!);
  return response.data;
};

const useMonthlyData = (month?: Date) =>
  useQuery(['monthly', month], getMonthlyData, {
    enabled: !!month,
  });

export default useMonthlyData;
