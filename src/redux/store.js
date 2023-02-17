import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/userSlice';

const store = configureStore({
  reducer: userReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;