import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { IAccount, IEditProfile, IMe } from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IUpdateResponse } from "@/common/interfaces/interfaces";

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

    // ====================== GET ACCOUNT
    getAccount: builder.query<IAccount, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.GET,
        method: "POST",
      }),
      providesTags: ["Account"],
    }),

    // ====================== UPDATE PROFILE
    updateProfile: builder.mutation<IUpdateResponse, IEditProfile>({
      query: (body) => ({
        url: API_ENDPOINTS.ACCOUNT.PROFILE.UPDATE,
        method: "PATCH",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { _id, ...updatedFields } = arg;

        const patchResult = dispatch(
          profileApi.util.updateQueryData("getAccount", undefined, (draft) => {
            if (draft) {
              Object.assign(draft, updatedFields);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Account"],
    }),
  }),
});

export const { useGetMeQuery, useGetAccountQuery, useUpdateProfileMutation } =
  profileApi;
