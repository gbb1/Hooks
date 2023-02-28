import { io } from "socket.io-client";

const socket = new io('http://localhost:8089', {
  // autoConnect: false,
  // withCredentials: true,
});

export default socket;
