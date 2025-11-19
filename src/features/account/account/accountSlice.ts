import { IMe } from "@/types/account/account/account.type";
import { Resource } from "@/types/enum.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { meApi } from "./accountApi";
import { ApiErrorType } from "@/types/api.types";

export interface AccountState {
  me: IMe | null;
  LOADING_ME: boolean;
  ERROR_ME: ApiErrorType;
}

export const me = createAsyncThunk<IMe>(
  "/user/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await meApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Error");
    }
  }
);

const initialState: AccountState = {
  me: null,
  LOADING_ME: false,
  ERROR_ME: null,
};

const accountSlice = createSlice({
  name: Resource.account,
  initialState,
  reducers: {
    clearMe: (state) => {
      state.me = null;
      state.ERROR_ME = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(me.fulfilled, (state, action) => {
        state.LOADING_ME = false;
        state.me = action.payload;
        state.ERROR_ME = null;
      })
      .addCase(me.pending, (state) => {
        state.LOADING_ME = true;
        state.ERROR_ME = null;
      })
      .addCase(me.rejected, (state, action) => {
        state.LOADING_ME = false;
        state.ERROR_ME = action.payload as string;
      }),
});

export const { clearMe } = accountSlice.actions;
export default accountSlice.reducer;
