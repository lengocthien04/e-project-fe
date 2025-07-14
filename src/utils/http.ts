import axios, { AxiosError, AxiosResponse, type AxiosInstance } from "axios";
import {
  clearLS,
  getAccessTokenFromLS,
  getAccessTokenFromSessionStorage,
  setAccessTokenToSessionStorage,
} from "./auth";
import config from "../configs/config";
import { HttpErrorKeys } from "../configs/constants/httpResponeErrorKey";
import { ErrorRespone, SuccessReponse } from "../types/common.type";

const domain = config.ApiURL;
export const ApiURL = domain;

class Http {
  instance: AxiosInstance;
  private accessToken: string | null;
  constructor() {
    this.accessToken =
      getAccessTokenFromLS() || getAccessTokenFromSessionStorage();
    this.instance = axios.create({
      baseURL: ApiURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = "Bearer " + this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: AxiosResponse<SuccessReponse<string>, any>) => {
        const { url } = response.config;
        if (url === "/v1/user/login") {
          const accessToken = response.data.data;
          if (accessToken !== undefined) {
            this.accessToken = accessToken;
            setAccessTokenToSessionStorage(accessToken);
          }
        }
        return response;
      },
      (error: AxiosError) => {
        const errorResponse = error.response?.data as ErrorRespone;
        const errorKey = errorResponse.error;
        if (errorKey == HttpErrorKeys.NoPermission) {
          clearLS();
          sessionStorage.clear();
          this.accessToken = null;
        }
        return Promise.reject(error);
      }
    );
  }
  instanceWithCustomTimeout(timeout: number) {
    const customInstance = axios.create({
      baseURL: this.instance.defaults.baseURL,
      timeout: timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Sao chép cấu hình interceptors
    customInstance.interceptors.request.use(
      // Sao chép từ this.instance.interceptors.request
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = "Bearer " + this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    customInstance.interceptors.response.use(
      // Sao chép từ this.instance.interceptors.response
      (response) => {
        const { url } = response.config;
        if (url === "/v1/user/login") {
          const accessToken = response.data.data;
          if (accessToken !== undefined) {
            this.accessToken = accessToken;
            setAccessTokenToSessionStorage(accessToken);
          }
        }
        return response;
      },
      (error) => {
        const errorResponse = error.response?.data as ErrorRespone;
        const errorKey = errorResponse.error;
        if (errorKey == HttpErrorKeys.NoPermission) {
          clearLS();
          sessionStorage.clear();
          this.accessToken = null;
        }
        return Promise.reject(error);
      }
    );

    return customInstance;
  }
}

const http = new Http().instance;
const httpLongTimeout = new Http().instanceWithCustomTimeout(60000);

export default http;
export { httpLongTimeout };
