import apiClient from './axios.config';
import { ApiResponse, AuthResponse, LoginRequest } from '../types/auth.types';

export const login = async (
  request: LoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    request
  );
  return response.data;
};