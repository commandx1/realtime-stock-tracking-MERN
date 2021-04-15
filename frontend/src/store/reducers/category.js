import {
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../types";

const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      state = action.payload;
      return state;
    case DELETE_CATEGORY:
      const updatedState = state.filter(
        (category) => category.id !== action.payload
      );
      state = updatedState;
      return state;
    case ADD_CATEGORY:
      return [...state, action.payload];
    case UPDATE_CATEGORY:
      const updatedCategories = state.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
      state = updatedCategories;
      return state;

    default:
      return state;
  }
};

export default reducer;
