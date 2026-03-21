import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import { IEditGeneralSettings, IGeneralSettings } from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { notificationSettingsApi } from "../../NotificationSettings/api/api";
import { privacySettingsApi } from "../../PrivacySettings/api/api";
import { IUpdateResponse } from "@/common/interfaces/interfaces";
import { resetSettingsResponse } from "../constants/contant";

export const generalSettingsApi = createApi({
  reducerPath: RESOURCE.GENERAL_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["GeneralSettings", "NotificationSettings", "PrivacySettings"],
  endpoints: (builder) => ({
    // ====================== GET GENERAL SETTINGS
    getGeneralSettings: builder.query<IGeneralSettings, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.GET,
        method: "POST",
      }),
      providesTags: ["GeneralSettings"],
    }),

    // ====================== EDIT GENERAL SETTINGS
    editGeneralSettings: builder.mutation<
      IUpdateResponse,
      IEditGeneralSettings
    >({
      query: (data) => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.UPDATE,
        method: "PATCH",
        body: data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { _id, ...updatedFields } = arg;

        const patchResult = dispatch(
          generalSettingsApi.util.updateQueryData(
            "getGeneralSettings",
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
    }),

    // ====================== RESET SETTINGS
    resetSettings: builder.mutation<IUpdateResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.ACCOUNT.SETTINGS.GENERAL_SETTINGS.RESET,
        method: "PATCH",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const generalPatchResult = dispatch(
          generalSettingsApi.util.updateQueryData(
            "getGeneralSettings",
            undefined,
            (draft) => {
              if (draft) {
                Object.assign(draft, resetSettingsResponse.generalSettings);
              }
            },
          ),
        );

        const notificationPatchResult = dispatch(
          notificationSettingsApi.util.updateQueryData(
            "getNotificationSettings",
            undefined,
            (draft) => {
              if (draft) {
                Object.assign(
                  draft,
                  resetSettingsResponse.notificationSettings,
                );
              }
            },
          ),
        );

        const privacyPatchResult = dispatch(
          privacySettingsApi.util.updateQueryData(
            "getPrivacySettings",
            undefined,
            (draft) => {
              if (draft) {
                Object.assign(draft, resetSettingsResponse.privacySettings);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          generalPatchResult.undo();
          notificationPatchResult.undo();
          privacyPatchResult.undo();
        }
      },
      invalidatesTags: [
        "GeneralSettings",
        "NotificationSettings",
        "PrivacySettings",
      ],
    }),
  }),
});

export const {
  useGetGeneralSettingsQuery,
  useEditGeneralSettingsMutation,
  useResetSettingsMutation,
} = generalSettingsApi;
