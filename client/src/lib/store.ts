import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import statReducer from "./statSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    stats: statReducer,
  },
});

// Optional: Export types for usage in selectors or dispatch
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;
