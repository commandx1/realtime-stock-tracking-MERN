import { UPDATE_SOCKET } from "../types";

export const updateSocket = (socket) => {
  return {
    type: UPDATE_SOCKET,
    payload: socket,
  };
};
