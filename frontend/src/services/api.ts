import axios, { AxiosHeaders, type AxiosError } from "axios";
import {
  type AuthData,
  type User,
  type ErrorResponse,
  type AxiosRequestConfigWithRetry,
  type LoginResponse,
  type ApiResponse,
  type UpdateProfileData,
  type ChangePasswordData,
  type ResetPasswordData,
} from "@/libs/types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = new AxiosHeaders(config.headers).set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (!error.response) {
      return Promise.reject({ message: "Network error" });
    }

    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw error;

        interface RefreshTokenResponse {
          accessToken: string;
          refreshToken: string;
        }

        const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_URL}/api/auth/refresh-token`,
          { refreshToken },
        );

        if (data.success) {
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);

          processQueue(null, data.data.accessToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${data.data.accessToken}`,
          };

          return api(originalRequest);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      status: error.response.status,
      message: error.response.data?.message || "Something went wrong",
    });
  },
);

export const login = async (data: AuthData): Promise<LoginResponse> => {
  const res = await api.post<ApiResponse<LoginResponse>>("/api/auth/login", data);
  return res.data.data;
};

export const signup = async (data: AuthData): Promise<LoginResponse> => {
  const res = await api.post<ApiResponse<LoginResponse>>("/api/auth/signup", data);
  return res.data.data;
};

export const forgotPassword = (data: { email: string }): Promise<ErrorResponse> =>
  api.post("/api/auth/forgot-password", data);

export const resetPassword = (data: ResetPasswordData): Promise<ErrorResponse> =>
  api.post("/api/auth/reset-password", data);

export const changePassword = (data: ChangePasswordData): Promise<ErrorResponse> =>
  api.post("/api/auth/change-password", data);

export const getProfile = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>("/api/auth/profile");
  return res.data.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const res = await api.put<ApiResponse<User>>("/api/auth/profile", data);
  return res.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const getGoogleAuthUrl = async (): Promise<string> => {
  const res = await api.get<ApiResponse<{ url: string }>>("/api/auth/google");
  return res.data.data.url;
};

export const googleLogin = async (code: string): Promise<LoginResponse> => {
  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  const res = await api.get<ApiResponse<LoginResponse>>(
    `/api/auth/google/callback?code=${code}&redirectUri=${encodeURIComponent(redirectUri)}`,
  );
  return res.data.data;
};