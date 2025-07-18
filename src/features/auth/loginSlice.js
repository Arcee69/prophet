import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import  Cookies from  "js-cookie"

import { api } from '../../services/api';
import { appUrls } from '../../services/urls';

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (values, { rejectWithValue }) => {
      try {
          const res = await api.post(appUrls?.LOGIN_URL, values);
          console.log(res, "back")
          if (res?.status === 200) {
              const data = res?.data?.data;
              Cookies.set("userProps", JSON.stringify(data), { expires: 3});
              Cookies.set("token", res?.data?.token)
              toast("Login Successfully", {
                  position: "top-right",
                  autoClose: 3500,
                  closeOnClick: true,
              });
          }
          return res?.data;
      } catch (err) {
          console.error(err, "Login Error");
          toast("Invalid Email/Password", {  //`${err?.response?.data?.message}`
              position: "top-right",
              autoClose: 3500,
              closeOnClick: true,
          });
          return rejectWithValue(err?.response?.data?.msg);
      }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;




