import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the user state
type UserState = {
  id: string;
  name: string;
  email: string;
} | null;

const userSlice = createSlice({
  name: "user",
  initialState: null as UserState,
  reducers: {
    addUser: (_state, action: PayloadAction<NonNullable<UserState>>) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
