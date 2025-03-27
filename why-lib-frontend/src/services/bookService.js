import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sach';

const getAllBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getBookById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const searchBooks = async (keyword) => {
  const response = await axios.get(`${API_URL}/search?keyword=${keyword}`);
  return response.data;
};

const createBook = async (bookData, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.post(API_URL, bookData, config);
  return response.data;
};

const updateBook = async (id, bookData, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.put(`${API_URL}/${id}`, bookData, config);
  return response.data;
};

const deleteBook = async (id, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

export default {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook
};
