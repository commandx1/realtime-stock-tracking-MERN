import React, { useState } from "react";
import useHttpClient from "../../../hooks/useHttpClient";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  updateCategory,
} from "../../../store/actions/category";
import AdderModal from "./components/NewCategoryModal";

const initialState = {
  id: "",
  label: "",
};

const Category = () => {
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [editableCategory, setEditableCategory] = useState(initialState);
  const [openNewCategoryModal, setopenNewCategoryModal] = useState(false);

  const handleChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setEditableCategory({ ...editableCategory, [inputName]: inputValue });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const response = await sendRequest(
      "http://localhost:5000/api/categories/" + editableCategory.id,
      "PATCH",
      JSON.stringify({
        label: editableCategory.label,
      }),
      { "Content-Type": "application/json" }
    );
    dispatch(updateCategory(editableCategory));
    setEditableCategory(initialState);
  };

  const handleDelete = async (cid) => {
    const response = await sendRequest(
      "http://localhost:5000/api/categories/" + cid,
      "DELETE"
    );
    dispatch(deleteCategory(cid));
  };

  const closeModal = () => setopenNewCategoryModal(false);

  return (
    <div className="list-group">
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className="list-group-item d-flex justify-content-between"
          >
            {editableCategory.id === category.id ? (
              <form onSubmit={formSubmit}>
                <input
                  name="label"
                  className="mx-3"
                  value={editableCategory.label}
                  onChange={handleChange}
                />
                <button type="submit">Gönder</button>
              </form>
            ) : (
              category.label
            )}
            <div>
              {editableCategory.id.length > 0 &&
              editableCategory.id === category.id ? (
                <span
                  className="mr-3"
                  onClick={() => setEditableCategory(initialState)}
                >
                  Vazgeç
                </span>
              ) : (
                <span
                  className="mr-3"
                  onClick={() => {
                    setEditableCategory({
                      id: category.id,
                      label: category.label,
                    });
                  }}
                >
                  düzenle
                </span>
              )}

              <span onClick={() => handleDelete(category.id)}>sil</span>
            </div>
          </div>
        ))
      ) : (
        <p>Henüz bir kategori eklemediniz.</p>
      )}
      <button
        className="btn btn-secondary"
        onClick={() => setopenNewCategoryModal(true)}
      >
        Yeni Kategori
      </button>

      <AdderModal
        type="category"
        openModal={openNewCategoryModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Category;
