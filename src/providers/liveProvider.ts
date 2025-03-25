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

const handleJoinedRoom = (data: any) => {
  console.log("Joined room: ", data);
};

const handleLeavedRoom = (data: any) => {
  console.log("Leaved room: ", data);
};

export const connectSocket = () => {
  socket.disconnect();
  console.log("Connecting socket...");
  socket.auth = { token: localStorage.getItem(TOKEN_KEY) };
  socket.connect();
};

socket.on("connect", () => {
  console.log("Socket connected");
  socket.on(HANDLE_JOINED_DEVICE_ROOM_CHANNEL, handleJoinedRoom);
  socket.on(HANDLE_LEAVED_DEVICE_ROOM_CHANNEL, handleLeavedRoom);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
  socket.off(HANDLE_JOINED_DEVICE_ROOM_CHANNEL, handleJoinedRoom);
  socket.off(HANDLE_LEAVED_DEVICE_ROOM_CHANNEL, handleLeavedRoom);
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
