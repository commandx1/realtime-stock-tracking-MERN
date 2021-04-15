import React, { useState } from "react";
import { useSelector } from "react-redux";
import useHttpClient from "../../../hooks/useHttpClient";
import NewProductModal from "./components/NewProductModal";
import Spinner from "../../../components/spinner/Spinner";
import UpdateProductModal from "./components/UpdateProductModal";
import ProductCard from "./components/ProductCard";

const Product = () => {
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const [productOnUpdate, setProductOnUpdate] = useState();
  const [productsByCategory, setProductsByCategory] = useState({
    selectedCategory: "",
    products: [],
  });
  const { isLoading } = useHttpClient();
  const { products, categories, socket } = useSelector((state) => state);

  const handleUpdateInputChange = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setProductOnUpdate({ ...productOnUpdate, [inputName]: inputValue });
  };

  const selectCategoryHandler = (id) => {
    const updatedProducts = products.filter(
      (product) => product.category === id
    );
    setProductsByCategory({ selectedCategory: id, products: updatedProducts });
  };

  socket.on("product", (data) => {
    const updatedProducts = productsByCategory.products.map((product) =>
      product.id === data.id ? data : product
    );
    setProductsByCategory({ ...productsByCategory, products: updatedProducts });
  });

  return (
    <>
      <button
        className="btn btn-secondary px-5 mb-3"
        onClick={() => setOpenNewProductModal(true)}
      >
        Ürün Ekle
      </button>
      <div className="d-flex mb-3 bg-white products-categories">
        {categories.length > 0 &&
          categories.map((category) => (
            <span
              key={category.id}
              className="mr-3 p-3"
              onClick={() => selectCategoryHandler(category.id)}
            >
              {category.label}
            </span>
          ))}
      </div>
      <div className="row mb-3 product-page">
        {productsByCategory.selectedCategory &&
        productsByCategory.products.length < 1 ? (
          <p className="mx-3">Bu kategoride ürün bulunamadı.</p>
        ) : productsByCategory.products.length > 0 ? (
          productsByCategory.products.map((product) => (
            <ProductCard /* Kategoriye göre ürünler */
              key={product.id}
              product={product}
              setProductOnUpdate={setProductOnUpdate}
            />
          ))
        ) : (
          products.length > 0 &&
          !isLoading &&
          products.map((product) => (
            <ProductCard /* Tüm ürünler */
              key={product.id}
              product={product}
              setProductOnUpdate={setProductOnUpdate}
            />
          ))
        )}
      </div>

      {/* Ürünlerin yenisinin eklendiği ve güncellendiği modallar */}
      <NewProductModal
        openModal={openNewProductModal}
        closeModal={() => setOpenNewProductModal(false)}
      />
      <UpdateProductModal
        productOnUpdate={productOnUpdate}
        closeUpdateProductModal={() => setProductOnUpdate(null)}
        handleChange={handleUpdateInputChange}
      />
      {isLoading && <Spinner />}
      {!isLoading && products.length < 1 && (
        <p className="mt-4">Ürün bulunamadı.</p>
      )}
    </>
  );
};

export default Product;
