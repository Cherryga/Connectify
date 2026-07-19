import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};
