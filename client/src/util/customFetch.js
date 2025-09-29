import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'https://footprint-logger-03-api.onrender.com/api/v1',
  withCredentials: true,
})

export default customFetch