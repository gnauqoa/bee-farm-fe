import {
  HANDLE_JOINED_DEVICE_ROOM_CHANNEL,
  HANDLE_LEAVED_DEVICE_ROOM_CHANNEL,
  TOKEN_KEY,
} from "../constants";
import { LiveProvider } from "@refinedev/core";
import { io } from "socket.io-client";

const token = localStorage.getItem(TOKEN_KEY);

export const socket = io("http://localhost:3000", {
  auth: {
    token: token,
  },
  autoConnect: !!token,
});

// Function to reconnect with updated token
export const connectSocket = () => {
  console.log("Connecting socket...");
  socket.auth = { token: localStorage.getItem(TOKEN_KEY) };
  socket.connect();
};

socket.on("connect", () => {
  console.log("Socket connected");
  socket.on(HANDLE_JOINED_DEVICE_ROOM_CHANNEL, (data) =>
    console.log("Joined room: ", data)
  );
  socket.on(HANDLE_LEAVED_DEVICE_ROOM_CHANNEL, (data) =>
    console.log("Leaved room: ", data)
  );
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
  socket.off(HANDLE_JOINED_DEVICE_ROOM_CHANNEL);
  socket.off(HANDLE_LEAVED_DEVICE_ROOM_CHANNEL);
});

export const websocketProvider: LiveProvider = {
  unsubscribe: (subscription) => {
    subscription.unsubscribe();
  },
  subscribe: ({ channel, callback }) => {
    if (!socket.connected) {
      connectSocket(); // Ensure connection is established with token
    }

    const eventHandler = (data: any) => callback(data);
    socket.on(channel, eventHandler);

    return {
      unsubscribe: () => {
        socket.off(channel, eventHandler);
      },
    };
  },
  publish: ({ channel, payload }) => {
    if (!socket.connected) {
      connectSocket();
    }
    socket.emit(channel, payload);
  },
};
