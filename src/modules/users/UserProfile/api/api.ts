import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IFindOneUserResponse } from "../types/types";

export const userProfileApi = createApi({
  reducerPath: RESOURCE.USER_PROFİLE,
  baseQuery: baseQuery,
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    findUser: builder.query<IFindOneUserResponse, string>({
      query: (userId: string) => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.FIND_ONE(userId),
        method: "POST",
      }),
      providesTags: ["UserProfile"],
    }),
  }),
});

export const { useFindUserQuery } = userProfileApi;
