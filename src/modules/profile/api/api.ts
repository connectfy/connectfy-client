import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { IMe } from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

export const profileApi = createApi({
  reducerPath: RESOURCE.PROFILE,
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ====================== GET ME
    getMe: builder.query<IMe, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.ME,
        method: "POST",
      }),
      providesTags: (result) =>
        result && result.user && result.user._id
          ? [{ type: "User", id: result.user._id }]
          : [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const { useGetMeQuery } = profileApi;
