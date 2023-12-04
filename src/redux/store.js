import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";

// Подключение редьюсера postsReducer к хранилищу Redux
const store = configureStore({
  reducer: {
    posts: postsReducer, // Связываем редьюсер postsReducer с разделом 'posts' в хранилище
    auth: authReducer
  },
});

export default store;