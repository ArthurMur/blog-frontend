import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  // Использование Axios для выполнения GET-запроса по пути '/auth/login'
  const { data } = await axios.post('/auth/login', params);
  // Возвращение полученных данных
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  // Использование Axios для выполнения GET-запроса по пути '/auth/me'
  const { data } = await axios.get('/auth/me');
  // Возвращение полученных данных
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  // Использование Axios для выполнения POST-запроса по пути '/auth/register'
  const { data } = await axios.post('/auth/register', params);
  // Возвращение полученных данных
  return data;
});

// Определение начального состояния Redux-хранилища
const initialState = {
 data: null,
 status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: { //Можно было бы реализовать через switch case, но мне было лень
      // Обработка состояния ожидания (pending)
      [fetchAuth.pending]: (state) => {
        state.data = null;        
        state.status = 'loading'; // Установка статуса загрузки
        },
    
        // Обработка успешного выполнения (fulfilled)
        [fetchAuth.fulfilled]: (state, action) => {
          state.data = action.payload; // Установка полученных данных в массив постов
          state.status = 'loaded';      // Установка статуса "загружено"
        },
    
        // Обработка ошибки (rejected)
        [fetchAuth.rejected]: (state) => {
          state.data = null;          
          state.status = 'error';    // Установка статуса "ошибка"
        },
        
        // Обработка состояния ожидания (pending)
        [fetchAuthMe.pending]: (state) => {
        state.data = null;        
        state.status = 'loading'; // Установка статуса загрузки
        },
    
        // Обработка успешного выполнения (fulfilled)
        [fetchAuthMe.fulfilled]: (state, action) => {
          state.data = action.payload; // Установка полученных данных в массив постов
          state.status = 'loaded';      // Установка статуса "загружено"
        },
    
        // Обработка ошибки (rejected)
        [fetchAuthMe.rejected]: (state) => {
          state.data = null;          
          state.status = 'error';    // Установка статуса "ошибка"
        },

        // Обработка состояния ожидания (pending)
        [fetchRegister.pending]: (state) => {
        state.data = null;        
        state.status = 'loading'; // Установка статуса загрузки
        },
    
        // Обработка успешного выполнения (fulfilled)
        [fetchRegister.fulfilled]: (state, action) => {
          state.data = action.payload; // Установка полученных данных в массив постов
          state.status = 'loaded';      // Установка статуса "загружено"
        },
    
        // Обработка ошибки (rejected)
        [fetchRegister.rejected]: (state) => {
          state.data = null;          
          state.status = 'error';    // Установка статуса "ошибка"
        },
  }

});

export const selectIsAuth = state => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
