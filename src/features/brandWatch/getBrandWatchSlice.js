import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchBrandWatch = createAsyncThunk(
    'brandWatch/fetchBrandWatch',
    async (values, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.BRANDWATCH_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getBrandWatchSlice = createSlice({
    name: 'brandWatch',
    initialState: {
      brandWatch: [],
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBrandWatch.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBrandWatch.fulfilled, (state, action) => {
          state.loading = false;
          state.brandWatch = action.payload;
        })
        .addCase(fetchBrandWatch.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getBrandWatchSlice.reducer;