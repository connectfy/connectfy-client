export interface ICountry {
  key: string;
  name: string;
  flag: string;
  code: string;
  numberLength: number;
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
