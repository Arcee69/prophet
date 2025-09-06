import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { appUrls } from '../../services/urls';


export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (page = 1, { rejectWithValue }) => {
      try {
        const data = await api.get(appUrls?.BLOGS_URL)
        return data?.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );

const getBlogsSlice = createSlice({
    name: 'blogs',
    initialState: {
      blogs: [],
      pagination: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBlogs.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchBlogs.fulfilled, (state, action) => {
          state.loading = false;
          state.blogs = action.payload;
          state.pagination = {
            currentPage: action.payload.current_page,
            nextPageUrl: action.payload.next_page_url,
            prevPageUrl: action.payload.prev_page_url,
            total: action.payload.total,
          };
        })
        .addCase(fetchBlogs.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default getBlogsSlice.reducer;