import { QueryClient } from '@tanstack/react-query';
import { buildQueryOptions } from './useGetMe';

const loaderMe = (queryClient: QueryClient) => async () => {
  try {
    // if the query is not in the cache, it will be fetched, otherwise it will return the cached data
    const data = await queryClient.ensureQueryData(buildQueryOptions());
    return data;
  } catch (error) {
    return null;
  }
};

export default loaderMe;
