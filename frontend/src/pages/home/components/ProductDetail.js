import React from "react";
import { useSelector } from "react-redux";
import Modal from "../../../components/modal/Modal";

const styles = {
  imgBox: {
    height: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  oldPrice: {
    fontSize: "20px",
    textDecoration: "line-through",
    fontWeight: 600,
    margin: 0,
  },
  newPrice: {
    fontSize: "23px",
    fontWeight: 700,
    margin: 0,
  },
};

const ProductDetail = ({
  productDetail,
  resetProductDetail,
  updateProductDetail,
}) => {
  const socket = useSelector((state) => state.socket);

  socket.on("product", (data) =>
    updateProductDetail({ ...productDetail, product: data })
  );

  return (
    <Modal openModal={productDetail.openModal} onClose={resetProductDetail}>
      {productDetail.product && (
        <div className="p-3">
          <div className="row align-items-center">
            <div className="col-5">
              <div style={styles.imgBox}>
                <img
                  src={
                    "https://realtime-stock-testapp.s3.eu-central-1.amazonaws.com/" +
                    productDetail.product.img
                  }
                  style={styles.image}
                />
              </div>
            </div>
            <div className="col-7">
              <h4 className="text-capitalize m-0">
                {productDetail.product.name}
              </h4>
              {productDetail.product.price_history && (
                <p style={styles.oldPrice}>
                  {parseInt(productDetail.product.price_history).toFixed(2)} TL
                </p>
              )}
              <p style={styles.newPrice}>
                {parseInt(productDetail.product.price).toFixed(2)} TL
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetail;
