import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchFaqs = createAsyncThunk(
    'faqs/fetchFaqs',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.FAQ_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getFaqsSlice = createSlice({
    name: 'faqs',
    initialState: {
      faqs: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchFaqs.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchFaqs.fulfilled, (state, action) => {
          state.loading = false;
          state.faqs = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchFaqs.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getFaqsSlice.reducer;