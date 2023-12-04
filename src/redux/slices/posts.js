// Импорт необходимых зависимостей
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// Функция для выполнения GET-запроса
const fetchData = async (path) => {
  const { data } = await axios.get(path);
  return data;
};

// Создание асинхронного thunk для получения постов
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  return fetchData('/posts');
});

// Создание асинхронного thunk для получения тегов
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  return fetchData('/tags');
});

// Создание асинхронного thunk для получения тегов
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  axios.delete(`/posts/${id}`);
});

// Определение начального состояния Redux-хранилища
const initialState = {
  // Раздел для постов
  posts: {
    items: [],      // Массив для хранения постов
    status: 'loading',  // Статус для отслеживания состояния асинхронной операции
  },
  // Раздел для тегов
  tags: {
    items: [],      // Массив для хранения тегов
    status: 'loading',  // Статус для отслеживания состояния асинхронной операции
  },
};

// Создание среза Redux для обработки постов
const postsSlice = createSlice({
  name: 'posts',  // Уникальное имя среза
  initialState,   // Начальное состояние среза
  reducers: {},   // Здесь могут быть добавлены редьюсеры

  // Обработчики для различных состояний асинхронного действия fetchPosts
  extraReducers: {
    // Обработка состояния ожидания (pending)
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];         // Очистка массива постов при ожидании
      state.posts.status = 'loading'; // Установка статуса загрузки
    },

    // Обработка успешного выполнения (fulfilled)
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload; // Установка полученных данных в массив постов
      state.posts.status = 'loaded';      // Установка статуса "загружено"
    },

    // Обработка ошибки (rejected)
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];       // Очистка массива постов при ошибке
      state.posts.status = 'error'; // Установка статуса "ошибка"
    },

    // Обработка состояния ожидания (pending)
    [fetchTags.pending]: (state) => {
      state.tags.items = [];         // Очистка массива постов при ожидании
      state.tags.status = 'loading'; // Установка статуса загрузки
    },

    // Обработка успешного выполнения (fulfilled)
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload; // Установка полученных данных в массив постов
      state.tags.status = 'loaded';      // Установка статуса "загружено"
    },

    // Обработка ошибки (rejected)
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];       // Очистка массива постов при ошибке
      state.tags.status = 'error'; // Установка статуса "ошибка"
    },

    // Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
    },
  } 
});


// Извлечение редьюсера из среза
export const postsReducer = postsSlice.reducer;
