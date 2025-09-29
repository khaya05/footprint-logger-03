import { io } from 'socket.io-client';

const socket = io(
  import.meta.env.PROD
    ? 'https://footprint-logger-03-api.onrender.com'
    : 'http://localhost:5100',
  {
    withCredentials: true,
    autoConnect: true,
  }
);

export default socket;