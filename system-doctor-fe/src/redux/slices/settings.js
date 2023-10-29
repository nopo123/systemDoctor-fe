import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  atempt: 0,
  timeout: false
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAtempt: (state) => {
      state.atempt += 1;
    },
    setOut: (state, action) => {
      state.timeout = action.payload;
    },
    clearOut: (state) => {
      state.atempt = 0;
    },
  }
});

export const { setAtempt, setOut, clearOut } = slice.actions;
export default slice.reducer;


