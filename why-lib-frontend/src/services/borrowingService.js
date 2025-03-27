import axios from 'axios';

const API_URL = 'http://localhost:5000/api/muonsach';

const borrowBook = async (bookId, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.post(API_URL, { MASACH: bookId }, config);
  return response.data;
};

const getBorrowRequests = async (token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getMyBorrowings = async (userId, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.get(`${API_URL}/docgia/${userId}`, config);
  return response.data;
};

const approveBorrowRequest = async (requestId, status, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.put(
    `${API_URL}/${requestId}/duyet`,
    { trangThai: status },
    config
  );
  return response.data;
};

const returnBook = async (requestId, token) => {
  const config = {
    headers: {
      'x-auth-token': token
    }
  };
  const response = await axios.put(`${API_URL}/${requestId}/tra`, {}, config);
  return response.data;
};

export default {
  borrowBook,
  getBorrowRequests,
  getMyBorrowings,
  approveBorrowRequest,
  returnBook
};
