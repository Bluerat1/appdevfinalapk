import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_DOMAIN = "https://appdevfinalpit.onrender.com";

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

// Register user
const register = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(REGISTER_URL, userData, config);
  return response.data;
};

// Login user
const login = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(LOGIN_URL, userData, config);

  if (response.data) {
    await AsyncStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout
const logout = async () => {
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("userInfo");
};

// Activate user
const activate = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(ACTIVATE_URL, userData, config);
  return response.data;
};

// Reset Password
const resetPassword = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(RESET_PASSWORD_URL, userData, config);
  return response.data;
};

// Reset Password Confirm
const resetPasswordConfirm = async (userData) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config);
  return response.data;
};

// Get User Info
const getUserInfo = async (accessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await axios.get(GET_USER_INFO, config);

  if (response.data) {
    await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  activate,
  resetPassword,
  resetPasswordConfirm,
  getUserInfo,
};

export default authService;