import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./Message";
import TokenService from "../services/TokenService";
import AuthService from "../services/AuthService";

const user = JSON.parse(localStorage.getItem("user"));

export const register = createAsyncThunk(
  "auth/register",
  async ({ firstName, lastName, email, address, phone, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(firstName, lastName, email, address, phone, password);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const registerMedic = createAsyncThunk(
  "auth/registerMedic",
  async ({ firstName, lastName, email, address, phone, password, education, specializations, experience,}, thunkAPI) => {
    try {
      const response = await AuthService.registerMedic(firstName, lastName, email, address, phone, password, education, specializations, experience, );
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.login(email, password);
      return { user: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const sendPasswordResetEmailAction = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email, thunkAPI) => {
    try {
      await AuthService.sendPasswordResetEmail(email);
      return "Password reset email sent successfully.";
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);


export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    await AuthService.logout();

    TokenService.removeUser();
    return true;
  } catch (error) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch(setMessage(message));
    return false;
  }
})


const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    refreshToken: (state, action) => {
        state.user.accessToken = action.payload;
    },
  },
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [sendPasswordResetEmailAction.fulfilled]: (state, action) => {
      state.successMessage = action.payload;
    },
    [sendPasswordResetEmailAction.rejected]: (state, action) => {
      state.errorMessage = action.error?.message;
    }
  },
});

const { reducer } = authSlice;
export const { refreshToken} = authSlice.actions
export default reducer;