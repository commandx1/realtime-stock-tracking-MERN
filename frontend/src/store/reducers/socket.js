import { UPDATE_SOCKET } from "../types";

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SOCKET:
      state = action.payload;
      return state;
    default:
      return state;
  }
};

export default reducer;
