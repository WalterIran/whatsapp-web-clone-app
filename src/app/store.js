import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from "../features/chatsSlice";

export const store = configureStore({

  reducer: {
      chat: chatsReducer,
  },
});