import { queryOptions, useQuery } from '@tanstack/react-query';
import { getArticles } from 'utils/axios';
import SearchParams from '../types/SearchParams';

export const buildQueryOptions = (searchParams: SearchParams) => {
  return queryOptions({
    queryKey: ['articles', searchParams],
    queryFn: () => getArticles(searchParams),
    staleTime: 1000 * 20
  });
};

const useGetArticles = (searchParams: SearchParams) => {
  const { data, isLoading, error } = useQuery(buildQueryOptions(searchParams));

  // We could go like this, but we'd endup with duplicated notifications
  /*   useEffect(() => {
    if (error) {
      console.log('Error in request');
    }
  }, [error]);
 */
  return { data, isLoading, error };
};

export default useGetArticles;
