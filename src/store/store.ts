import { Resource } from "../types/enum.types";
import { configureStore, Middleware } from "@reduxjs/toolkit";

// Auth
import authReducer, { logout } from "@/features/auth/auth/authSlice";
import userReducer from "@/features/auth/user/userSlice";

// Account
// import accountReducer from "@/features/account/account/accountSlice";
import generalSettingsReducer from "@/features/account/settings/general/generalSettingsSlice";
import privacySettingsReducer from "@/features/account/settings/privacy/privacySettingsSlice";
import notificationSettingsReducer from "@/features/account/settings/notification/notificationSettingsSlice";

export const resetMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    const result = next(action);

    if (action.type === logout.fulfilled.type) {
      // localStorage təmizləmək (və ya lazımi cleanup)
      localStorage.removeItem("access_token");
      storeAPI.dispatch({ type: "RESET_APP" });
    }

    return result;
  };

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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resetMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
