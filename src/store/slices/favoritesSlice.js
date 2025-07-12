import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Favorileri backend'den çek
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (token, thunkAPI) => {
    const res = await axios.get(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
);

// Favoriye ekle
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ productId, token }, thunkAPI) => {
    await axios.post(`${API_URL}/favorites/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return productId;
  }
);

// Favoriden çıkar
export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ productId, token }, thunkAPI) => {
    await axios.delete(`${API_URL}/favorites/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return productId;
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.items.some(item => item._id === action.payload)) {
          state.items.push({ _id: action.payload });
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export const selectFavoriteItems = (state) => state.favorites.items;
export const selectIsFavorite = (productId) => (state) =>
  state.favorites.items.some(item => item._id === productId);

export default favoritesSlice.reducer;
