import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export const BASE_URL = 'http://localhost:4000';

export default api;
