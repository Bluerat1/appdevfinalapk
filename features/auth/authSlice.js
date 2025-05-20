import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "./authService";

// Initialize user and userInfo from AsyncStorage (handled asynchronously in App.js or elsewhere)
const initialState = {
  user: null, // Will be set after AsyncStorage loads
  userInfo: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Load initial state from AsyncStorage (called in App.js or a top-level component)
export const loadAuthState = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    const userInfo = await AsyncStorage.getItem("userInfo");
    return {
      user: user ? JSON.parse(user) : null,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
    };
  } catch (error) {
    console.error("Failed to load auth state:", error);
    return { user: null, userInfo: null };
  }
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const data = await authService.login(userData);
      const userInfo = await authService.getUserInfo(data.access);
      return { ...data, userInfo }; // Pass both
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  await authService.logout();
});

export const activate = createAsyncThunk(
  "auth/activate",
  async (userData, thunkAPI) => {
    try {
      return await authService.activate(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPasswordConfirm(userData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) throw new Error("No access token");
      return await authService.getUserInfo(accessToken);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.userInfo = action.payload.userInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.userInfo = action.payload.userInfo;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userInfo = null;
      })
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  },
});

export const { reset, setAuthState } = authSlice.actions;

export default authSlice.reducer;