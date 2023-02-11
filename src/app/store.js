import { configureStore } from "@reduxjs/toolkit";
import  from '';

const store = configureStore({
  reducer: {
    agora: agoraReducer,
  }
});

export default store;