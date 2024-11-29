import { axiosInstance } from './axios';
import type { ApiResponse } from 'types/api';
import type { Article } from 'types/article';
import type { Tag } from 'types/tag';

interface ArticlesParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string[];
  tag?: string;
}

export const getArticles = async (params?: ArticlesParams) => {
  const response = await axiosInstance<ApiResponse<Article[]>>({
    method: 'GET',
    url: '/api/articles',
    params
  });

  return response.data;
};

export const getArticle = async (id: number) => {
  const response = await axiosInstance<ApiResponse<Article>>({
    method: 'GET',
    url: `/api/articles/${id}`
  });

  return response.data;
};

export const getTags = async () => {
  const response = await axiosInstance<ApiResponse<Tag[]>>({
    method: 'GET',
    url: '/api/tags'
  });

  return response.data;
};

export const createTag = async (name: string) => {
  const response = await axiosInstance<Tag>({
    method: 'POST',
    url: '/api/tags',
    data: { name }
  });

  return response.data;
};