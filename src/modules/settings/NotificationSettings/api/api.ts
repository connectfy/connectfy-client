import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IEditNotificationSettings,
  INotificationSettings,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { IUpdateResponse } from "@/common/interfaces/interfaces";

export const notificationSettingsApi = createApi({
  reducerPath: RESOURCE.NOTIFICATION_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["NotificationSettings"],
  endpoints: (builder) => ({
    // ====================== GET NOTIFICATION SETTINGS
    getNotificationSettings: builder.query<INotificationSettings, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.NOTIFICATION_SETTINGS.GET,
        method: "POST",
      }),
      providesTags: ["NotificationSettings"],
    }),

    // ====================== EDIT NOTIFICATION SETTINGS
    editNotificationSettings: builder.mutation<
      IUpdateResponse,
      IEditNotificationSettings
    >({
      query: (data) => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.NOTIFICATION_SETTINGS.UPDATE,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { _id, ...updatedFields } = arg;

        const patchResult = dispatch(
          notificationSettingsApi.util.updateQueryData(
            "getNotificationSettings",
            undefined,
            (draft) => {
              if (draft) {
                Object.assign(draft, updatedFields);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["NotificationSettings"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useEditNotificationSettingsMutation,
} = notificationSettingsApi;
