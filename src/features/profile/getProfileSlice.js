import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.PROFILE_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getProfileSlice = createSlice({
    name: 'profile',
    initialState: {
      profile: [],
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        })
        .addCase(fetchProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getProfileSlice.reducer;