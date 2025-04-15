import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for stats
type Stats = {
  monthly: any | null;
  weekly: any | null;
};

const initialState: Stats = {
  monthly: null,
  weekly: null,
};

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

export const { setMonthlyStats, setWeeklyStats, resetStats } = statsSlice.actions;
export default statsSlice.reducer;
