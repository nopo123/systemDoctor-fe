import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  atempt: 0,
  timeout: false
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {}
});

export const { } = slice.actions;
export default slice.reducer;


