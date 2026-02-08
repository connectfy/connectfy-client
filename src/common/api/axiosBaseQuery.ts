import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { api } from "./axios";

export type AxiosQueryArgs = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  data?: any;
  body?: any;
  params?: any;
};

export const baseQuery: BaseQueryFn<AxiosQueryArgs, unknown, unknown> = async ({
  url,
  method,
  data,
  body,
  params,
}) => {
  try {
    const res = await api({ url, method, data: body ?? data, params });
    return { data: res.data };
  } catch (err: any) {
    return { error: err.response?.data || { message: err.message } };
  }
};
