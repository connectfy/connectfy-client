import { FailedRequest } from "@/types/api.types";
import { LANGUAGE } from "@/types/enum.types";
import axios from "axios";

const BASE = `http://${import.meta.env.VITE_IP_ADDRESS}:3000/api`;

const instance = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    const _lang = localStorage.getItem("lang") || LANGUAGE.EN;

    // ƏSAS DƏYİŞİKLİK: Refresh endpoint-ə Authorization header göndərmə
    const isRefreshEndpoint = config.url?.includes("/auth/refresh");

    if (access_token && !isRefreshEndpoint) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    if (config.data) {
      if (
        typeof config.data === "object" &&
        !(config.data instanceof FormData)
      ) {
        config.data._lang = _lang;
      } else if (config.data instanceof FormData) {
        config.data.append("_lang", _lang);
      } else if (typeof config.data === "string") {
        try {
          const parsed = JSON.parse(config.data);
          parsed._lang = _lang;
          config.data = JSON.stringify(parsed);
        } catch (e) {
          config.data += `&_lang=${_lang}`;
        }
      }
    } else {
      if (config.method?.toLowerCase() === "get") {
        config.params = { ...(config.params || {}), _lang };
      } else {
        config.data = { _lang };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!originalRequest) return Promise.reject(err);

    const isAuthEndpoint =
      originalRequest.url && originalRequest.url.includes("/auth/refresh");

    const status =
      err.response?.status ?? err.response?.data?.error?.statusCode;

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((error) => Promise.reject(error));
      }

      isRefreshing = true;

      try {
        const refreshUrl = `${BASE}/auth/refresh`;

        // ƏSAS DƏYİŞİKLİK: Lang parametrini göndər, amma Authorization header-siz
        const _lang = localStorage.getItem("lang") || LANGUAGE.EN;
        const response = await axios.post(
          refreshUrl,
          { _lang },
          { withCredentials: true }
        );

        const newAccessToken = response.data?.access_token;
        if (!newAccessToken)
          throw new Error("No access token in refresh response");

        localStorage.setItem("access_token", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
