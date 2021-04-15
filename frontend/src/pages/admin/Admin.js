import React, { useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./admin.scss";
import Category from "./subpages/Category";
import Product from "./subpages/Product";
import useHttpClient from "../../hooks/useHttpClient";
import { fetchCategories } from "../../store/actions/category";

const Admin = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const { sendRequest } = useHttpClient();

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

  return (
    <>
      <header className="page-header">ADMIN</header>
      <hr></hr>
      <div className="admin-menu mb-5">
        <NavLink to="/admin/kategoriler">Kategoriler</NavLink>
        <NavLink to="/admin/urunler">Ürünler</NavLink>
      </div>
      {categories.length > 0 && (
        <>
          <Route path="/admin/kategoriler">
            <Category />
          </Route>
          <Route path="/admin/urunler">
            <Product />
          </Route>
        </>
      )}
    </>
  );
};

export default Admin;
