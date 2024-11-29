import { QueryClient } from '@tanstack/react-query';
import { getArticles } from 'utils/axios';
import { buildQueryOptions } from './useGetArticles';

const loaderArticles = (queryClient: QueryClient) => async () => {
  const data = await queryClient.ensureQueryData(
    buildQueryOptions({ page: 1 })
  );
  return data;
};

export default loaderArticles;
