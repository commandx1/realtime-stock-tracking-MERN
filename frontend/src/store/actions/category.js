import {
  FETCH_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../types";

export const fetchCategories = (categories) => {
  return {
    type: FETCH_CATEGORIES,
    payload: categories,
  };
};

export const addCategory = (category) => {
  return {
    type: ADD_CATEGORY,
    payload: category,
  };
};

export const updateCategory = (category) => {
  return {
    type: UPDATE_CATEGORY,
    payload: category,
  };
};

export const deleteCategory = (categoryId) => {
  return {
    type: DELETE_CATEGORY,
    payload: categoryId,
  };
};
