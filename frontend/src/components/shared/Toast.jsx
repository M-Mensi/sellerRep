import React, { useState, useEffect } from "react";
import "../../styles/components.css";

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
