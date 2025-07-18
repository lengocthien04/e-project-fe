import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // Handle 401 and refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const { data } = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {
                  refreshToken,
                }
              );
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("refreshToken", data.refreshToken);
              error.config.headers.Authorization = `Bearer ${data.accessToken}`;
              return this.client(error.config);
            }
          } catch {
            localStorage.clear();
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config = {}): Promise<T> {
    const { data } = await this.client.get(url, config);
    return data;
  }

  async post<T>(url: string, body = {}, config = {}): Promise<T> {
    const { data } = await this.client.post(url, body, config);
    return data;
  }

  async put<T>(url: string, body = {}, config = {}): Promise<T> {
    const { data } = await this.client.put(url, body, config);
    return data;
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    const { data } = await this.client.delete(url, config);
    return data;
  }
}

export const api = new ApiClient();
