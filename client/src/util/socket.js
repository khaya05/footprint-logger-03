import { io } from 'socket.io-client'

console.log(document.cookie)

const socket = io('http://localhost:5100', {
  withCredentials: true
})

export default socket;