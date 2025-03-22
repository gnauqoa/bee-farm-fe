import { TOKEN_KEY } from "../constants";
import { LiveProvider } from "@refinedev/core";
import { io } from "socket.io-client";

const getToken = () => localStorage.getItem(TOKEN_KEY);

export const socket = io("http://localhost:3000", {
  auth: {
    token: getToken(),
  },
  autoConnect: true,
});

// Function to reconnect with updated token
export const connectSocket = () => {
  console.log("Connecting socket...");
  socket.auth = { token: getToken() };
  socket.connect();
};

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
