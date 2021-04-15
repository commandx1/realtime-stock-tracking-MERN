import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./navigation.scss";

const Navigation = () => {
  const history = useHistory();
  return (
    <nav className="navigation">
      <div className="container h-100 d-flex align-items-center justify-content-between">
        <span className="logo" onClick={() => history.push("/urunler")}>
          LOGO
        </span>
        <div className="navigation-list">
          <NavLink activeClassName="active" to="/urunler">
            Anasayfa
          </NavLink>
          <NavLink activeClassName="active" to="/admin">
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
