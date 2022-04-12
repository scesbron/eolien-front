import { useLocation } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export const useQuery = () => (
  new URLSearchParams(useLocation().search)
);
