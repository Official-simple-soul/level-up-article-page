import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from 'config';

interface UseDeleteArticleOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const deleteArticle = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/articles/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

const useDeleteArticle = ({ onSuccess, onError }: UseDeleteArticleOptions = {}) => {
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess,
    onError
  });
};

export default useDeleteArticle; 