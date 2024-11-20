// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { isAuthenticated: false, token: "" };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    logoutState: (state) => {
      state.isAuthenticated = false;
      state.token = ""
    },
  },
});

export const { loginState, logoutState } = authSlice.actions;
export default authSlice.reducer;
