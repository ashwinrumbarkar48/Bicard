import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSettings } from '../services/content.service';

export const loadSettings = createAsyncThunk('settings/load', async () => {
  return fetchSettings();
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(loadSettings.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default settingsSlice.reducer;
