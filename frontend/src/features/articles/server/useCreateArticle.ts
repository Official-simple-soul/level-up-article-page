import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from 'config';

interface CreateArticleParams {
  formData: FormData;
  id?: string;
}

const useCreateArticle = (options: any) => {
  return useMutation({
    mutationFn: async ({ formData, id }: CreateArticleParams) => {
      const response = await axios({
        method: id ? 'POST' : 'POST',
        url: `${API_URL}/api/articles${id ? `/${id}` : ''}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return response.data;
    },
    ...options,
  });
};

export default useCreateArticle;
