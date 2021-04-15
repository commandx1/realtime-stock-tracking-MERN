import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../components/modal/Modal";
import useHttpClient from "../../../../hooks/useHttpClient";
import { addCategory } from "../../../../store/actions/category";

const AdderModal = ({ type, openModal, closeModal }) => {
  const { isLoading, sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  const [label, setLabel] = useState("");

  const handleChange = (event) => {
    setLabel(event.target.value);
  };

  const submitNewCategoryForm = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest(
        "http://localhost:5000/api/categories",
        "POST",
        JSON.stringify({ label }),
        { "Content-Type": "application/json" }
      );

      dispatch(addCategory(response.category));
      closeModal();
    } catch (error) {}
  };

  const modalForm =
    type === "category" ? (
      <form onSubmit={submitNewCategoryForm}>
        <div className="row align-items-center">
          <div className="col-3">
            <span>Kategori Adı: </span>
          </div>
          <div className="col-9">
            <input
              name="label"
              className="form-control"
              label={label}
              onChange={handleChange}
            />
          </div>
          <div className="ml-auto col-4 mt-3">
            <button type="submit" className="btn btn-primary w-100">
              Ekle
            </button>
          </div>
          <div className="col-4 mt-3">
            <button
              onClick={closeModal}
              className="btn btn-outline-danger w-100"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </form>
    ) : (
      <form></form>
    );

  return (
    <Modal openModal={openModal} onClose={closeModal}>
      {modalForm}
    </Modal>
  );
};

export default AdderModal;
