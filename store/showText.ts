import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isBalanceVisible: boolean;
}

const initialState: UIState = {
  isBalanceVisible: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleBalanceVisibility: (state) => {
      state.isBalanceVisible = !state.isBalanceVisible;
    },
    setBalanceVisibility: (state, action) => {
      state.isBalanceVisible = action.payload;
    },
  },
});

export const { toggleBalanceVisibility, setBalanceVisibility } = uiSlice.actions;

export default uiSlice.reducer;
