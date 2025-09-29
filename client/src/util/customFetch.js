import axios from 'axios';

const customFetch = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://footprint-logger-03-api.onrender.com/api/v1'
    : '/api/v1',
  withCredentials: true,
});

export default customFetch;