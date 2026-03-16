import { InternalAxiosRequestConfig } from "axios";

export interface ICountry {
  key: string;
  name: string;
  flag: string;
  code: string;
  numberLength: number;
  format: string;
  totalLength: number;
}

export interface IPagination {
  // pageSize?: number | undefined;
  // current?: number;
  totalCount: number;
  // totalPages: number;
  // next?: number | null;
  // prev?: number | null;
}

export interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface IUpdateResponse {
  success: boolean;
  [key: string]: any;
}
