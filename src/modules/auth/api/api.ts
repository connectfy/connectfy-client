import { baseQuery } from "@/common/api/axiosBaseQuery";
import { RESOURCE } from "@/common/enums/enums";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ICheckUnique,
  ILoginForm,
  ILoginResponse,
  ISignupForm,
  ISignupResponse,
  ISignupVerifyForm,
  ISignupVerifyResponse,
  IForgotPasswordResponse,
  IForgotPasswordForm,
  IResetPasswordResponse,
  IResetPasswordForm,
  IGoogleLoginForm,
  IGoogleSignupForm,
  IIsValidToken,
  IRefreshResponse,
  IAuthenticateUserResponse,
  IRestoreAccountResponse,
  IRestoreAccount,
  IAuthenticateUser,
} from "../types/types";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

export const authApi = createApi({
  reducerPath: RESOURCE.AUTH,
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // ====================== LOGIN
    login: builder.mutation<ILoginResponse, ILoginForm>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ====================== SINGUP
    signup: builder.mutation<ISignupResponse, Omit<ISignupForm, "confirm">>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ====================== VERIFY SIGNUP
    signupVerify: builder.mutation<ISignupVerifyResponse, ISignupVerifyForm>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP_VERIFY,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== RESEND SIGNUP VERIFY
    resendSignupVerify: builder.mutation<ISignupVerifyResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.RESEND_SIGNUP_VERIFY,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== CHECK UNIQUE
    checkUnique: builder.mutation<boolean, ICheckUnique>({
      query: (data) => ({
        url: API_ENDPOINTS.USER.CHECK_UNIQUE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== GOOGLE LOGIN
    googleLogin: builder.mutation<ILoginResponse, IGoogleLoginForm>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== GOOGLE SIGNUP
    googleSignup: builder.mutation<ISignupVerifyResponse, IGoogleSignupForm>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.GOOGLE_SIGNUP,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== FORGOT PASSWORD
    forgotPassword: builder.mutation<
      IForgotPasswordResponse,
      IForgotPasswordForm
    >({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== RESET PASSWORD
    resetPassword: builder.mutation<IResetPasswordResponse, IResetPasswordForm>(
      {
        query: (data) => ({
          url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Auth"],
      },
    ),

    // ======================== VALIDATE TOKEN
    isValidToken: builder.mutation<boolean, IIsValidToken>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.IS_VALID_TOKEN,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== REFRESH
    refresh: builder.mutation<IRefreshResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== AUTHENTICATE USER
    authenticateUser: builder.mutation<
      IAuthenticateUserResponse,
      IAuthenticateUser
    >({
      query: () => ({
        url: API_ENDPOINTS.AUTH.AUTHENTICATE_USER,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // ======================== RESTORE ACCOUNT
    restoreAccount: builder.mutation<IRestoreAccountResponse, IRestoreAccount>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.RESTORE_ACCOUNT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSignupVerifyMutation,
  useResendSignupVerifyMutation,
  useCheckUniqueMutation,
  useGoogleLoginMutation,
  useGoogleSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useIsValidTokenMutation,
  useRefreshMutation,
  useAuthenticateUserMutation,
  useRestoreAccountMutation,
} = authApi;
