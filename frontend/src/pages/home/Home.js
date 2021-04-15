import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, useLocation } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import useHttpClient from "../../hooks/useHttpClient";
import { fetchCategories } from "../../store/actions/category";
import ProductCard from "./components/ProductCard";
import ProductDetail from "./components/ProductDetail";
import ProductsByCategory from "./components/ProductsByCategory";
import "./home.scss";

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state);
  const { sendRequest, isLoading } = useHttpClient();
  const [productDetail, setProductDetail] = useState({
    openModal: false,
    product: null,
  });

  const location = useLocation();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/categories"
        );
        dispatch(fetchCategories(response.categories));
      } catch (error) {}
    };
    getCategories();
  }, []);

  const resetProductDetail = () =>
    setProductDetail({ openModal: false, product: null });

  const updateProductDetail = (detail) => setProductDetail(detail);

  return (
    <div className="row">
      {/* Anasayfa kategorileri gösteren sidemenu */}
      <div className="col-md-4 mb-4">
        <div className="sidebar-categories card h-100">
          <div className="card-header">
            <h4>Kategoriler</h4>
          </div>
          <div className="card-body list-group p-0">
            <NavLink to="/urunler" className="list-group-item" exact>
              Tüm Ürünler
            </NavLink>
            {categories.length > 0 &&
              categories.map((category) => (
                <NavLink
                  key={category.id}
                  to={
                    "/urunler/kategoriler/" +
                    category.label.replace(/\s+/g, "-").toLowerCase()
                  }
                  className="list-group-item"
                >
                  {category.label}
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      {/* Anasayfa ürün kartları */}
      <div className="col-md-8">
        <div className="row">
          {isLoading && <Spinner />}
          {products.length > 0 &&
            location.pathname === "/urunler" &&
            products.map((product) => (
              <div
                key={product.id}
                className="col-md-6 col-lg-4 mb-4"
                onClick={() => setProductDetail({ openModal: true, product })}
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>

        {/* Ürünlerin kategoriye göre listelendiği sayfalar */}
        {categories.length > 0 &&
          categories.map((category) => (
            <Route
              key={category.id}
              path={
                "/urunler/kategoriler/" +
                category.label.replace(/\s+/g, "-").toLowerCase()
              }
            >
              <ProductsByCategory
                category={category}
                updateProductDetail={(product) => setProductDetail(product)}
              />
            </Route>
          ))}
      </div>

      {/* Modal */}
      <ProductDetail
        productDetail={productDetail}
        resetProductDetail={resetProductDetail}
        updateProductDetail={updateProductDetail}
      ></ProductDetail>
    </div>
  );
};

export default Home;
