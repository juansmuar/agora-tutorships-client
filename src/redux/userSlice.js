import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../utils/axios';
import history from '../utils/history';
import {
  TOKEN,
  LOADING,
  AUTHORIZED,
  UNAUTHORIZED,
} from '../actions/constants';
import {
  loginUser,
  fetchData,
  registerUser,
} from './userApi';

const initialState = {
  token: localStorage.getItem(TOKEN) || null,
  currentUser: {
    _id: null,
    name: null,
    type: null,
    profilephoto: null,
    email: null,
    focus: null,
    description: null,
    schedule: null,
    price: null,
  },
  login_failed: false,
  auth_status: LOADING,
  emailIsTaken: false,
  isProfileTooltipCollapsed: true,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  try {
    const response = await axios.post('/login', { email, password })
    const token = response.data.token;
    localStorage.setItem(TOKEN, token);
    return (response.data);
  } catch (error) {
    console.log(error);
    return error;
  };
});

export const getUserData = createAsyncThunk('user/getUserData', async (token) => {
  const response = await fetchData(token);
  return response;
});

export const register = createAsyncThunk('user/register', async ({type, inputs}) => {
  const response = await registerUser(type, inputs);
  console.log('register: ', response);
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState : initialState,
  reducers: {
    logout : (state) => {
      localStorage.removeItem(TOKEN);
      state.token = null;
      state.currentUser = {};
      state.login_failed = false;
      state.auth_status = UNAUTHORIZED; 
    },
    toggleProfileTooltip : (state) => {
      state.isProfileTooltipCollapsed = !state.isProfileTooltipCollapsed;
    },
    authFailed : (state) => {
      state.auth_status = UNAUTHORIZED; 
    },
  },
  extraReducers: (builder) => {
    builder
    //login
      .addCase(login.fulfilled, (state, action) => {
        console.log('login fullfilled: ', action.payload)
        state.token = action.payload.token;
        state.auth_status = LOADING;
        state.status = 'succeeded';
        state.login_failed = false;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.login_failed = true;
      })
    //Userdata  
      .addCase(getUserData.fulfilled, (state, action) => {
        state.token = localStorage.getItem(TOKEN);
        console.log('payload: ', action.payload);
        console.log('payload: ', action.payload.userData);
        state.currentUser = {
          _id: action.payload.userId,
          name: action.payload.userData.name,
          type: action.payload.type,
          profilephoto: action.payload.userData.profilephoto,
          email: action.payload.userData.email,
          focus: action.payload.userData.focus || null,
          description: action.payload.userData.description || null,
          schedule: action.payload.userData.schedule || null,
          price: action.payload.userData.price || null,
        };
        state.auth_status = AUTHORIZED;
      })
      .addCase(getUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.auth_status = UNAUTHORIZED;
      })
    //Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
}
);

export const { logout, toggleProfileTooltip, authFailed } = userSlice.actions;

export default userSlice.reducer;