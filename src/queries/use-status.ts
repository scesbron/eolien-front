import { useQuery } from 'react-query';
import { windFarm } from '../api';
import { Status } from '../types';

const getStatus = async (sessionId?: string, handle?: string): Promise<Status> => {
  const response = await windFarm.status(sessionId!, handle!);
  return response.data;
};

const useStatus = (sessionId?: string, handle?: string) =>
  useQuery(['status'], () => getStatus(sessionId, handle), {
    enabled: !!sessionId && !!handle,
    refetchInterval: 2000,
  });

export default useStatus;
