import React from "react";
import "./spinner.scss";

const Spinner = (props) => {
  return (
    <>
      <div className={props.asOverlay ? "overlay" : null}></div>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Spinner;
