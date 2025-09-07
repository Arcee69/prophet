import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async (values, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.BRANDS_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getBrandsSlice = createSlice({
    name: 'brands',
    initialState: {
      brands: [],
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBrands.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBrands.fulfilled, (state, action) => {
          state.loading = false;
          state.brands = action.payload;
        })
        .addCase(fetchBrands.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getBrandsSlice.reducer;