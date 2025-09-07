import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchSubSettings = createAsyncThunk(
    'subSettings/fetchSubSettings',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.SUBSCRIPTION_SETTINGS_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getSubSettingsSlice = createSlice({
    name: 'subSettings',
    initialState: {
      subSettings: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSubSettings.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSubSettings.fulfilled, (state, action) => {
          state.loading = false;
          state.subSettings = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchSubSettings.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getSubSettingsSlice.reducer;