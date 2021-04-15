import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/modal/Modal";
import Spinner from "../../../../components/spinner/Spinner";
import useHttpClient from "../../../../hooks/useHttpClient";
import {
  deleteProduct,
  updateProduct,
} from "../../../../store/actions/product";

const UpdateProductModal = ({
  productOnUpdate,
  closeUpdateProductModal,
  handleChange,
}) => {
  const { sendRequest, isLoading } = useHttpClient();
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state);

  const formSubmit = async (e) => {
    e.preventDefault();
    const response = await sendRequest(
      "http://localhost:5000/api/products/" + productOnUpdate.id,
      "PATCH",
      JSON.stringify({
        name: productOnUpdate.name,
        price: productOnUpdate.price,
      }),
      { "Content-Type": "application/json" }
    );

    socket.emit("updateProduct", response.product);
    socket.on("product", (data) => {
      dispatch(updateProduct(data));
    });
    closeUpdateProductModal();
  };

  const deleteProductHandler = async () => {
    try {
      await sendRequest(
        "http://localhost:5000/api/products/" + productOnUpdate.id,
        "DELETE"
      );

      dispatch(deleteProduct(productOnUpdate.id));
      closeUpdateProductModal();
    } catch (error) {}
  };

  return (
    <>
      <Modal openModal={productOnUpdate} onClose={closeUpdateProductModal}>
        {isLoading && <Spinner asOverlay />}
        {productOnUpdate && (
          <form onSubmit={formSubmit}>
            <div
              className="card-image d-flex align-items-center justify-content-center border m-3"
              style={{ height: "200px" }}
            >
              <img
                src={
                  "https://realtime-stock-testapp.s3.eu-central-1.amazonaws.com/" +
                  productOnUpdate.img
                }
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
            <div className="card-body">
              <span>Ürün Adı: </span>
              <input
                className="form-control mb-2"
                type="text"
                name="name"
                value={productOnUpdate.name}
                onChange={handleChange}
              />

              <span>Ürün Fiyatı: </span>
              <input
                className="form-control"
                type="number"
                name="price"
                value={productOnUpdate.price}
                onChange={handleChange}
              />
              {productOnUpdate.price_history && (
                <p className="m-0">
                  Fiyat Geçmişi:{" "}
                  {parseInt(productOnUpdate.price_history).toFixed(2)} TL
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary mx-3">
              Güncelle
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteProductHandler}
            >
              Ürünü Sil
            </button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default UpdateProductModal;
