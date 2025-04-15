import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your stats state
interface StatsState {
  monthly: any;
  weekly: any;
}

// Initial state for stats
const initialState: StatsState = {
  monthly: null,
  weekly: null,
};

// Create the slice
const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setMonthlyStats: (state, action: PayloadAction<any>) => {
      state.monthly = action.payload;
    },
    setWeeklyStats: (state, action: PayloadAction<any>) => {
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
