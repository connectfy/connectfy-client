import {
  CustomAxiosRequestConfig,
  FailedRequest,
} from "@/common/interfaces/interfaces";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import axios, { AxiosError } from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { checkDeviceId } from "../utils/checkDevice";
import { securityEvents } from "../helpers/security.events";

const BASE = `http://${import.meta.env.VITE_IP_ADDRESS}:3000/api/v1`;

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 30_000,
});

export const refreshClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 15_000,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

const handleForceLogout = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  securityEvents.emit("FORCE_LOGOUT");
};

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const _lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) || LANGUAGE.EN;
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    const isRefreshEndpoint = config.url?.includes(API_ENDPOINTS.AUTH.REFRESH);

    if (token && !isRefreshEndpoint) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach _lang logic...
    if ((config.method || "get").toLowerCase() === "get") {
      config.params = { ...(config.params || {}), _lang };
    } else {
      if (config.data instanceof FormData) {
        config.data.append("_lang", _lang);
      } else if (typeof config.data === "string") {
        try {
          const parsed = JSON.parse(config.data);
          parsed._lang = _lang;
          config.data = JSON.stringify(parsed);
        } catch {
          config.data = `${config.data}&_lang=${_lang}`;
        }
      } else {
        config.data = { ...(config.data || {}), _lang };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest) return Promise.reject(error);

    const errorData = error.response?.data as any;
    const status = errorData?.error?.statusCode || error.response?.status;

    // Check if backend explicitly instructed a navigation (force logout)
    // Note: Adjust the exact path based on how your BaseException serializes in NestJS
    const navigate =
      errorData?.navigate ||
      errorData?.error?.data?.navigate ||
      errorData?.data?.navigate;

    if (navigate) {
      handleForceLogout();
      return Promise.reject(error);
    }

    const isRefreshEndpoint = originalRequest.url?.includes(
      API_ENDPOINTS.AUTH.REFRESH,
    );

    // If 401, not a forced navigate, and not already retried
    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api.request(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshUrl = API_ENDPOINTS.AUTH.REFRESH.startsWith("http")
          ? API_ENDPOINTS.AUTH.REFRESH
          : `${BASE}${API_ENDPOINTS.AUTH.REFRESH}`;

        const _lang =
          localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) || LANGUAGE.EN;
        const deviceId = checkDeviceId();

        const resp = await refreshClient.post(
          refreshUrl,
          { _lang, deviceId },
          { withCredentials: true },
        );

        const newAccessToken = (resp.data as any)?.access_token;
        if (!newAccessToken) throw new Error("No access token provided");

        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

        // Resolve queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (refreshErr: any) {
        // If the refresh request itself fails (or returns navigate: true)
        processQueue(refreshErr, null);
        handleForceLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
