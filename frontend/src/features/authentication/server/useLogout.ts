import { useQueryClient } from '@tanstack/react-query';
import { buildQueryOptions } from './useGetMe';

const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('token');

    queryClient.invalidateQueries({
      queryKey: buildQueryOptions().queryKey
    });
  };

  return logout;
};

export default useLogout;
