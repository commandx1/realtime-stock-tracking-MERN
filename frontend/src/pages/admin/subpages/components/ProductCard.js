import React from "react";

const ProductCard = ({ product, setProductOnUpdate }) => {
  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div
        className="card p-3 h-100"
        onClick={() => setProductOnUpdate(product)}
      >
        <div className="card-image d-flex align-items-center justify-content-center border">
          <img
            src={
              "https://realtime-stock-testapp.s3.eu-central-1.amazonaws.com/" +
              product.img
            }
          />
        </div>
        <div className="card-body px-0">
          <p className="font-weight-bold price text-capitalize">
            {product.name}
          </p>
          {product.price_history && (
            <p className="old-price mb-1 font-weight-bold">
              {parseInt(product.price_history).toFixed(2)} TL
            </p>
          )}
          <p className="font-weight-bold">
            {parseInt(product.price).toFixed(2)} TL
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
