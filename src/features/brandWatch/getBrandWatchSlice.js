// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../../services/api';
// import { appUrls } from '../../services/urls';


// export const fetchBrandWatch = createAsyncThunk(
//     'brandWatch/fetchBrandWatch',
//     async (values, { rejectWithValue }) => {
//       try {
//         const data = await api.get(appUrls?.BRANDWATCH_URL)
//         return data?.data;
//       } catch (error) {
//         return rejectWithValue(error);
//       }
//     }
//   );

// const getBrandWatchSlice = createSlice({
//     name: 'brandWatch',
//     initialState: {
//       brandWatch: [],
//       pagination: null,
//       loading: false,
//       error: null
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//       builder
//         .addCase(fetchBrandWatch.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(fetchBrandWatch.fulfilled, (state, action) => {
//           state.loading = false;
//           state.brandWatch = action.payload;
//           state.pagination = {
//             currentPage: action.payload.pagination?.current_page,
//             nextPageUrl: action.payload.pagination?.next_page_url,
//             prevPageUrl: action.payload.pagination?.prev_page_url,
//             total: action.payload.pagination?.total,
//           };
//         })
//         .addCase(fetchBrandWatch.rejected, (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         });
//     }
//   });
  
//   export default getBrandWatchSlice.reducer;

// getBrandWatchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';

export const fetchBrandWatch = createAsyncThunk(
    'brandWatch/fetchBrandWatch',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(`${appUrls?.BRANDWATCH_URL}?page=${page}`);
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);

const getBrandWatchSlice = createSlice({
    name: 'brandWatch',
    initialState: {
      data: [], 
      pagination: null,
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
          state.data = action.payload.data || action.payload; 
          state.pagination = action.payload.pagination || null;
        })
        .addCase(fetchBrandWatch.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
});

export default getBrandWatchSlice.reducer;