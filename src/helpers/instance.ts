// import { API_ENDPOINTS } from "@constants/apiEndpoints";
// import { logout, setAccessToken } from "@features/auth/authSlice";
// import { type FailedRequest } from "../types/api.types";
import { LANGUAGE } from "@/types/enum.types";
import axios from "axios";

const instance = axios.create({
  // baseURL: BASE_URL,
  // baseURL: BASE_URL,
  // baseURL: "http://10.180.32.180:3000/api",
  baseURL: `http://${import.meta.env.VITE_IP_ADDRESS}:3000/api`,
  // baseURL: "http://api-gateway-main-app:3000/api",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token")
    const _lang = localStorage.getItem("lang") || LANGUAGE.EN;

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    if (config.data) {
      if (typeof config.data === "object") {
        config.data._lang = _lang;
      } else if (config.data instanceof FormData) {
        config.data.append("_lang", _lang);
      } else if (typeof config.data === "string") {
        try {
          const parsedData = JSON.parse(config.data);
          parsedData._lang = _lang;
          config.data = JSON.stringify(parsedData);
        } catch (e) {
          config.data += `&_lang=${_lang}`;
        }
      }
    } else {
      if (config.method?.toLowerCase() === "get") {
        config.params = {
          ...config.params,
          _lang: _lang,
        };
      } else {
        config.data = { _lang };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// instance.interceptors.request.use((config) => {
//   const state = store.getState().auth;
//   const accessToken = state.access_token;

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// let isRefreshing = false;
// let failedQueue: FailedRequest[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token!);
//   });
//   failedQueue = [];
// };
// instance.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;

//     if (
//       err.response?.data?.error?.statusCode === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes(API_ENDPOINTS.USERS.REFRESH)
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return instance(originalRequest);
//           })
//           .catch((error) => {
//             return Promise.reject(error);
//           });
//       }

//       isRefreshing = true;

//       try {
//         const response = await instance.post(API_ENDPOINTS.USERS.REFRESH, {});

//         const newAccessToken = response.data.access_token;

//         store.dispatch(setAccessToken(newAccessToken));
//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return instance(originalRequest);
//       } catch (refreshErr) {
//         processQueue(refreshErr, null);
//         store.dispatch(logout());
//         window.location.href = "/login";
//         return Promise.reject(refreshErr);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(err);
//   },
// );

export default instance;
