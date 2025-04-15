import { createSlice } from "@reduxjs/toolkit";


// Initial state for stats
const initialState = {
  monthly: null,
  weekly: null,
};

// Create the slice
const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setMonthlyStats: (state, action) => {
      state.monthly = action.payload;
    },
    setWeeklyStats: (state, action) => {
      state.weekly = action.payload;
    },
    resetStats: (state) => {
      state.monthly = null;
      state.weekly = null;
    },
  },
});

// Export actions and reducer
export const { setMonthlyStats, setWeeklyStats, resetStats } = statsSlice.actions;
export default statsSlice.reducer;
