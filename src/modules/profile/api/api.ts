import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { IAccount, IMe } from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

export const profileApi = createApi({
  reducerPath: RESOURCE.PROFILE,
  baseQuery: baseQuery,
  tagTypes: ["User", "Account"],
  endpoints: (builder) => ({
    // ====================== GET ME
    getMe: builder.query<IMe, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.ME,
        method: "POST",
      }),
      providesTags: (result) =>
        result && result?._id
          ? [{ type: "User", id: result._id }]
          : [{ type: "User", id: "LIST" }],
    }),

    // getAccount
    getAccount: builder.query<IAccount, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.GET_ACCOUNT,
        method: "POST",
      }),
      providesTags: ["Account"],
    }),
  }),
});

export const { useGetMeQuery, useGetAccountQuery } = profileApi;
