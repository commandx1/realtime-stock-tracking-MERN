import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../../components/spinner/Spinner";
import useHttpClient from "../../../hooks/useHttpClient";

const ProductsByCategory = ({ category, updateProductDetail }) => {
  const { isLoading, sendRequest } = useHttpClient();
  const [products, setProducts] = useState([]);
  const socket = useSelector((state) => state.socket);

  socket.on("product", (data) => {
    const updatedProducts = products.map((product) =>
      product.id === data.id ? data : product
    );
    setProducts(updatedProducts);
  });

  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const response = await sendRequest(
          "http://localhost:5000/api/products/category/" + category.id
        );
        setProducts(response.products);
      };
      fetchCategories();
    } catch (error) {}
  }, []);

  return (
    <div className="row">
      {isLoading && <Spinner />}
      {products.length > 0 &&
        !isLoading &&
        products.map((product, index) => (
          <div
            key={product.id}
            className="col-md-6 col-lg-4 mb-4"
            onClick={() => updateProductDetail(product)}
          >
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
          </div>
        ))}
      {!isLoading && products.length < 1 && (
        <p>Bu kategoride ürün bulunamadı.</p>
      )}
    </div>
  );
};

export default ProductsByCategory;
