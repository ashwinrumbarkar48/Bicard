import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('bicard_user')) || null;
  } catch {
    return null;
  }
})();

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('bicard_token', data.token);
    localStorage.setItem('bicard_user', JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    isAuthenticated: !!localStorage.getItem('bicard_token'),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('bicard_token');
      localStorage.removeItem('bicard_user');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
