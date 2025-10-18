import { Resource } from "../types/enum.types";
import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [Resource.auth]: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
