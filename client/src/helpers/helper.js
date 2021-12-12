import axios from 'axios';

const API = 'http://localhost:5000';

export const executeKillApi = async (id) =>
  await axios.get(`${API}/kill/${id}`);
