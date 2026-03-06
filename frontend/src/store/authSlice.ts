import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState, type User } from "@/libs/types";

interface LoginPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<LoginPayload>) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    
    setAuth(state, action: PayloadAction<Partial<AuthState>>) {
      if (action.payload.accessToken !== undefined) {
        state.accessToken = action.payload.accessToken;
        if (state.accessToken !== null) {
          localStorage.setItem("accessToken", state.accessToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      }
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
        if (state.refreshToken !== null) {
          localStorage.setItem("refreshToken", state.refreshToken);
        } else {
          localStorage.removeItem("refreshToken");
        }
      }
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
        if (state.user !== null) {
          localStorage.setItem("user", JSON.stringify(state.user));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
