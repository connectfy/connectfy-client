import {
  CustomAxiosRequestConfig,
  FailedRequest,
} from "@/common/interfaces/interfaces";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import axios, { AxiosError } from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { checkDeviceId } from "../utils/checkDevice";
import { authTokenManager } from "../helpers/authToken.manager";
import { securityEvents } from "../helpers/security.events";

const BASE = `http://${import.meta.env.VITE_IP_ADDRESS}:3000/api/v1`;

/**
 * Use a dedicated client for regular requests (has interceptors).
 * Keep a separate client for refresh requests to avoid interceptor loops.
 */
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

/**
 * Queue item type (resolve receives the new token).
 * We keep using your project's FailedRequest shape (imported above). If it differs,
 * ensure it contains resolve: (token: string) => void and reject: (err: any) => void.
 */
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

/**
 * Request interceptor:
 * - inject Authorization from authTokenManager
 * - attach _lang param consistently (handles JSON, FormData, and GET params)
 */
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const _lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) || LANGUAGE.EN;
    const token = authTokenManager.getToken("accessToken");
    const isRefreshEndpoint = config.url?.includes(API_ENDPOINTS.AUTH.REFRESH);

    // Authorization tənzimləməsi
    if (token && !isRefreshEndpoint) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

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

/**
 * Response interceptor:
 * - When 401 occurs, try to refresh once (only one refresh in-flight).
 * - Queue concurrent requests while refreshing and retry them after refresh completes.
 * - Use securityEvents to notify the app instead of forcing a redirect here.
 */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;
    if (!originalRequest) return Promise.reject(error);

    const status =
      (error.response && (error.response.data as any)?.error?.statusCode) ||
      error.response?.status;

    const isRefreshEndpoint = originalRequest.url?.includes(
      API_ENDPOINTS.AUTH.REFRESH,
    );

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
        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        authTokenManager.setToken({
          token: newAccessToken,
          type: "accessToken",
        });

        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authTokenManager.clear("all");

        securityEvents.emit("FORCE_LOGOUT");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
