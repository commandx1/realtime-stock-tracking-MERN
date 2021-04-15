import { createStore, combineReducers } from "redux";
import CategoryReducer from "./reducers/category";
import ProductsReducer from "./reducers/product";
import socketReducer from "./reducers/socket";

const reducers = combineReducers({
  categories: CategoryReducer,
  products: ProductsReducer,
  socket: socketReducer,
});

export const store = createStore(reducers);
