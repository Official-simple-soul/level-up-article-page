import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from 'utils/axios';

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);

      // we want to re fetch the me query to get the new user data, since we got authenticated
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });
};

export default useLogin;
