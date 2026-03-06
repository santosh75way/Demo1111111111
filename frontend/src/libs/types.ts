import { type AxiosRequestConfig } from "axios";
import { type ReactElement } from "react";

export interface AuthData {
  fullName?: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN" | "STAFF";
  phoneNumber?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; 
  price: number;
  active: boolean;
}

export interface ErrorResponse {
  message: string;
}

export interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export interface AppItem {
  id: string;
  label: string;
  icon: ReactElement;
  path: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "STAFF";
}

export interface UpdateProfileData {
  fullName: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginResponse extends LoginResponse {}


