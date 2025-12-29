import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic API error type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Parse error from axios error or unknown error
 */
function parseError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    return {
      message:
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An unexpected error occurred",
      status: axiosError.response?.status || 500,
      code: axiosError.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    status: 500,
  };
}

/**
 * Generic GET request with error handling
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(url, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Generic POST request with error handling
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Generic PUT request with error handling
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

/**
 * Generic DELETE request with error handling
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.delete<T>(url, config);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: parseError(error) };
  }
}

export default apiClient;
