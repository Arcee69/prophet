import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchPricing = createAsyncThunk(
    'pricing/fetchPricing',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.SUBSCRIPTION_SETTINGS_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const fetchPricingSlice = createSlice({
    name: 'pricing',
    initialState: {
      pricing: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchPricing.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPricing.fulfilled, (state, action) => {
          state.loading = false;
          state.pricing = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchPricing.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default fetchPricingSlice.reducer;