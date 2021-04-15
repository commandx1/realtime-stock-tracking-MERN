import {
  FETCH_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../types";

const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      state = action.payload;
      return state;
    case DELETE_PRODUCT:
      const updatedState = state.filter(
        (product) => product.id !== action.payload
      );
      state = updatedState;
      return state;
    case ADD_PRODUCT:
      return [...state, action.payload];
    case UPDATE_PRODUCT:
      const updatedProducts = state.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      state = updatedProducts;
      return state;

    default:
      return state;
  }
};

export default reducer;
