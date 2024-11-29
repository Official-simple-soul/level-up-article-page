import { queryOptions, useQuery } from '@tanstack/react-query';
import { getMe } from 'utils/axios';

export const buildQueryOptions = () => {
  return queryOptions({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 10,
    retry: false
  });
};

const useGetMe = () => {
  const { data, isLoading, error } = useQuery(buildQueryOptions());

  return { data, isLoading, error };
};

export default useGetMe;
