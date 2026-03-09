import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeactivateAccount,
  IDeactivateAccountResponse,
  IDeleteAccount,
  IDeleteAccountResponse,
  ILogoutResponse,
  IUpdateEmail,
  IUpdateEmailResponse,
  IUpdatePassword,
  IUpdatePasswordResponse,
  IUpdatePhoneNumber,
  IUpdatePhoneNumberResponse,
  IUpdateTwoFactor,
  IUpdateTwoFactorResponse,
  IUpdateUsername,
  IUpdateUsernameResponse,
  IVerifyChangeEmail,
  IVerifyChangeEmailResponse,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { profileApi } from "@/modules/profile/api/api";

export const accountSettingsApi = createApi({
  reducerPath: RESOURCE.ACCOUNT_SETTINGS,
  baseQuery: baseQuery,
  tagTypes: ["User", "AccountSettings"],
  endpoints: (builder) => ({
    // ====================== UPDATE USERNAME
    updateUsername: builder.mutation<IUpdateUsernameResponse, IUpdateUsername>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_USERNAME,
        method: "PATCH",
        body: data,
      }),
      /**
       * Optimistic update: instantly update profileApi.getMe cache.
       * We patch getMe (undefined arg) because getMe takes void in your code.
       * Rollback on failure.
       */
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // apply optimistic change to getMe
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMe", undefined, (draft: any) => {
            // guard: draft.user might be undefined in some cases
            if (draft) {
              draft.username = arg.username;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
      /**
       * Invalidate the User tag so other subscribers (if any) refetch.
       * If the response includes the updated user id, return it; otherwise fallback to LIST.
       */
      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== UPDATE EMAIL
    updateEmail: builder.mutation<IUpdateEmailResponse, IUpdateEmail>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_EMAIL,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== UPDATE PASSWORD
    updatePassword: builder.mutation<IUpdatePasswordResponse, IUpdatePassword>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== VERIFY CHANGE EMAIL
    verifyChangeEmail: builder.mutation<
      IVerifyChangeEmailResponse,
      IVerifyChangeEmail
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.VERIFY_CHANGE_EMAIL,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data) {
          dispatch(
            profileApi.util.updateQueryData(
              "getMe",
              undefined,
              (draft: any) => {
                if (draft) {
                  draft.email = data.email;
                  draft.updatedAt = data.updatedAt;
                }
              },
            ),
          );
        }
      },

      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== UPDATE PHONE NUMBER
    updatePhoneNumber: builder.mutation<
      IUpdatePhoneNumberResponse,
      IUpdatePhoneNumber
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHANGE_PHONE_NUMBER,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getMe", undefined, (draft: any) => {
            if (draft) {
              draft.phoneNumber = arg.phoneNumber;
            }
          }),
        );

        try {
          const { data: updatedData } = await queryFulfilled;

          dispatch(
            profileApi.util.updateQueryData(
              "getMe",
              undefined,
              (draft: any) => {
                if (draft) {
                  draft.phoneNumber = updatedData.phoneNumber;
                }
              },
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["AccountSettings"],
    }),

    // ====================== LOGOUT
    logout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ====================== DELETE ACCOUNT
    deleteAccount: builder.mutation<IDeleteAccountResponse, IDeleteAccount>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.DELETE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // ====================== DEACTIVATE ACCOUNT
    deactivateAccount: builder.mutation<
      IDeactivateAccountResponse,
      IDeactivateAccount
    >({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateTwoFactor: builder.mutation<
      IUpdateTwoFactorResponse,
      IUpdateTwoFactor
    >({
      query: (data) => ({
        url: API_ENDPOINTS.USER.UPDATE_TWO_FACTOR,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data) {
          dispatch(
            profileApi.util.updateQueryData(
              "getMe",
              undefined,
              (draft: any) => {
                if (draft) {
                  draft.isTwoFactorEnabled = data.isTwoFactorEnabled;
                  draft.updatedAt = data.updatedAt;
                }
              },
            ),
          );
        }
      },
      invalidatesTags: ["AccountSettings"],
    }),
  }),
});

export const {
  useUpdateUsernameMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useVerifyChangeEmailMutation,
  useUpdatePhoneNumberMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
  useDeactivateAccountMutation,
  useUpdateTwoFactorMutation,
} = accountSettingsApi;
