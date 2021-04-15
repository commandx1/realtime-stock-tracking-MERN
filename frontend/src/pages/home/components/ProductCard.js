import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card__image">
        <img
          src={
            "https://realtime-stock-testapp.s3.eu-central-1.amazonaws.com/" +
            product.img
          }
        />
      </div>
      <p className="product-name">{product.name}</p>
      {product.price_history && (
        <p className="price-history m-0">
          {parseInt(product.price_history).toFixed(2)} TL
        </p>
      )}
      <p className="price">{parseInt(product.price).toFixed(2)} TL</p>
    </div>
  );
};

export default ProductCard;
