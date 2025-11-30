import { Resource } from "../types/enum.types";
import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "@/features/auth/auth/authSlice";
import userReducer from "@/features/auth/user/userSlice";

// Account
// import accountReducer from "@/features/account/account/accountSlice";
import generalSettingsReducer from "@/features/account/settings/general/generalSettingsSlice";
import privacySettingsReducer from "@/features/account/settings/privacy/privacySettingsSlice";
import notificationSettingsReducer from "@/features/account/settings/notification/notificationSettingsSlice";

export const store = configureStore({
  reducer: {
    // Auth
    [Resource.auth]: authReducer,
    [Resource.user]: userReducer,

    // Account
    // [Resource.account]: accountReducer,
    [Resource.generalSettings]: generalSettingsReducer,
    [Resource.privacySettings]: privacySettingsReducer,
    [Resource.notificationSettings]: notificationSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
