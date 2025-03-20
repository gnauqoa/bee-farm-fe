import { LiveProvider } from "@refinedev/core";
import { API_URL } from "../constants";
import { io } from "socket.io-client";

const socket = io(API_URL);

export const websocketProvider: LiveProvider = {
  unsubscribe: (subscription) => {
    subscription.unsubscribe();
  },
  subscribe: ({ channel, callback }) => {
    const eventHandler = (data: any) => callback(data);
    socket.on(channel, eventHandler);

    return {
      unsubscribe: () => {
        socket.off(channel, eventHandler);
      },
    };
  },
  publish: ({ channel, payload }) => {
    socket.emit(channel, payload);
  },
};
