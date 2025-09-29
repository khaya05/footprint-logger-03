import { io } from 'socket.io-client'

console.log(document.cookie)

const socket = io('https://footprint-logger-03-api.onrender.com', {
  withCredentials: true
})

export default socket;