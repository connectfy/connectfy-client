import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IFindAllResponse } from "@/common/interfaces/interfaces";
import { ISearchUserResult, ISearchUsers } from "../types/types";

export const allUsersApi = createApi({
  reducerPath: RESOURCE.ALL_USERS,
  baseQuery: baseQuery,
  tagTypes: ["AllUsers"],
  endpoints: (builder) => ({
    search: builder.query<IFindAllResponse<ISearchUserResult>, ISearchUsers>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.SEARCH,
        method: "POST",
        body,
      }),
      providesTags: ["AllUsers"],
    }),
  }),
});

export const { useSearchQuery } = allUsersApi;
