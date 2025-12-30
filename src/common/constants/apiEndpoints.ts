export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    SIGNUP_VERIFY: "/auth/signup/verify",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
    GOOGLE_LOGIN: "/auth/google/login",
    GOOGLE_SIGNUP: "/auth/google/signup",
    FACE_DESCRIPTOR: "/auth/face-descriptor",
    IS_VALID_TOKEN: "/auth/is-valid-token",
    REFRESH: "/auth/refresh",
    AUTHENTICATE_USER: "/auth/authenticate-user",
    DELETE_ACCOUNT: "/auth/delete-account",
    RESTORE_ACCOUNT: "/auth/restore-account",
    DEACTIVATE_ACCOUNT: "/auth/deactivate-account",
  },
  USER: {
    ME: "/user/me",
    CHANGE_USERNAME: "/user/change-username",
    CHANGE_EMAIL: "/user/change-email",
    VERIFY_CHANGE_EMAIL: "/user/change-email/verify",
    CHANGE_PASSWORD: "/user/change-password",
    CHANGE_PHONE_NUMBER: "/user/change-phone-number",
  },
  ACCOUNT: {
    SETTINGS: {
      GENERAL_SETTINGS: {
        UPDATE: "/account/settings/general-settings/update",
        RESET: "/account/settings/general-settings/reset",
      },
      NOTIFICATION_SETTINGS: {
        UPDATE: "/account/settings/notification-settings/update",
      },
      PRIVACY_SETTINGS: {
        UPDATE: "/account/settings/privacy-settings/update",
      },
    },
  },
};
