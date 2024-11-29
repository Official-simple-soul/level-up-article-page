import { axiosInstance } from './axios';
import type { ApiResponse } from 'types/api';
import type { Comment } from '../types/comment';

export const getComments = async (articleId: number | string) => {
  const response = await axiosInstance<ApiResponse<Comment[]>>({
    method: 'GET',
    url: `/api/articles/${articleId}/comments`
  });

  return response.data;
};

export const createComment = async (articleId: number | string, content: string) => {
  const response = await axiosInstance<ApiResponse<Comment>>({
    method: 'POST',
    url: `/api/articles/${articleId}/comments`,
    data: { content }
  });

  return response.data;
};

export const deleteComment = async (articleId: number | string, commentId: number) => {
  const response = await axiosInstance<ApiResponse<void>>({
    method: 'DELETE',
    url: `/api/articles/${articleId}/comments/${commentId}`
  });

  return response.data;
};
