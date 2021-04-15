import React from "react";
import "./modal.scss";

const Modal = ({ openModal, onClose, children }) => {
  return (
    <>
      {openModal && <div className="modal-backdrop" onClick={onClose} />}
      <div
        style={{
          transform: openModal ? "translateY(0%)" : "translateY(-100%)",
        }}
        className="modal-wrapper"
      >
        <div className="modal-content">{children}</div>
      </div>
    </>
  );
};

export default Modal;
