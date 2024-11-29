import { axiosInstance } from './axios';
import type { ApiResponse } from 'types/api';
import type { User } from 'types/user';

export const updateUser = async (userId: number, formData: FormData) => {
  const response = await axiosInstance<ApiResponse<User>>({
    method: 'POST',
    url: `/api/users/${userId}`,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await axiosInstance<ApiResponse<void>>({
    method: 'DELETE',
    url: `/api/users/${userId}`,
  });

  return response.data;
}; 