import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const getMe = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

export default {
  login,
  register,
  getMe
};
