import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchSubscriptions',
    async (values, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.SUBSCRIPTION_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getSubscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState: {
      subscriptions: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSubscriptions.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSubscriptions.fulfilled, (state, action) => {
          state.loading = false;
          state.subscriptions = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchSubscriptions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getSubscriptionSlice.reducer;