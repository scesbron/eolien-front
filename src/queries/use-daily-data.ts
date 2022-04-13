import { useQuery } from 'react-query';
import { isValid } from 'date-fns';
import { windFarm } from '../api';
import { DailyData } from '../types';

const getDailyData = async (day: Date, sessionId?: string): Promise<DailyData> => {
  const response = await windFarm.dailyData(sessionId!, day);
  return response.data;
};

const useDailyData = (day: Date, sessionId?: string) =>
  useQuery(['daily', day], () => getDailyData(day, sessionId), {
    enabled: !!sessionId && isValid(day),
  });

export default useDailyData;
