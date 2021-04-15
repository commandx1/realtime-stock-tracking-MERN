import React from "react";
import { Switch, Route } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import Home from "../pages/home/Home";

const Routes = () => {
  const containerStyle = {
    minHeight: "calc(100vh - 128px)",
  };
  return (
    <div className="container my-5" style={containerStyle}>
      <Switch>
        <Route path="/urunler">
          <Home />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
      </Switch>
    </div>
  );
};

export default Routes;
