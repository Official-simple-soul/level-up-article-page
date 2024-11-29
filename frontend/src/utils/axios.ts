import axios from 'axios';
import SearchParams from 'features/articles/types/SearchParams';
import ApiLoginResponse from 'features/authentication/types/ApiLoginResponse';
import LoginForm from 'features/authentication/types/LoginForm';
import ApiArticle from 'types/ApiArticle';
import ApiPaginatedResponse from 'types/ApiPaginatedResponse';
import ApiUser from 'types/ApiUser';
import CreateArticleFormData from 'types/CreateArticvleFormData';
import { PAGE_SIZE } from './constants';
import { API_URL } from 'config';
import RegisterUser from 'types/RegisterUser';

export const axiosBaseConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const axiosInstance = axios.create(axiosBaseConfig);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (data: LoginForm) => {
  const response = await axiosInstance<ApiLoginResponse>({
    method: 'POST',
    url: '/api/login',
    data
  });

  return response.data;
};

export const register = async (data: FormData) => {
  const response = await axiosInstance<ApiLoginResponse>({
    method: 'POST',
    url: '/api/register',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance<ApiUser>({
    method: 'GET',
    url: '/api/me'
  });

  return response.data;
};

export const getArticles = async (searchParams: SearchParams) => {
  const response = await axiosInstance<ApiPaginatedResponse<ApiArticle>>({
    method: 'GET',
    url: '/api/articles',
    params: {
      ...searchParams,
      perPage: PAGE_SIZE
    }
  });

  return response.data;
};

export const createArticle = async (data: CreateArticleFormData) => {
  const response = await axiosInstance<CreateArticleFormData>({
    method: 'POST',
    url: '/api/articles',
    data
  });

  return response.data;
};
