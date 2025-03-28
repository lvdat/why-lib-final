import axios from "axios";

const API_URL = "http://localhost:5000/api/nhaxuatban";

const getAllNhaXuatBan = async () => {
  const response = await axios.get(API_URL);
  return response.data.nxbs;
}

export default {
  getAllNhaXuatBan
}
