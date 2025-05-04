import { io } from "socket.io-client";

const socket = io("https://91.108.104.109:3000", {
  autoConnect: false,
  transports: ["websocket"], // optional but good for performance
});

export default socket;
