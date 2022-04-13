import { QueryFunctionContext, useQuery } from 'react-query';
import { windFarm } from '../api';
import { YearlyData } from '../types';

const getYearlyData = async ({
  queryKey,
}: QueryFunctionContext<[string, Date | undefined, Date | undefined]>): Promise<YearlyData> => {
  const [, startDate, endDate] = queryKey;
  const response = await windFarm.yearlyData(startDate!, endDate!);
  return response.data;
};

const useYearlyData = (startDate?: Date, endDate?: Date) =>
  useQuery(['yearly', startDate, endDate], getYearlyData, {
    enabled: !!startDate && !!endDate,
  });

export default useYearlyData;
