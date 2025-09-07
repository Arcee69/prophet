import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (values, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.TRANSACTIONS_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getTransactionSlice = createSlice({
    name: 'transactions',
    initialState: {
      transactions: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTransactions.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTransactions.fulfilled, (state, action) => {
          state.loading = false;
          state.transactions = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchTransactions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getTransactionSlice.reducer;