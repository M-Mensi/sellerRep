import React from "react";
import "../../styles/components.css";

export const Spinner = ({ size = "medium", className }) => {
  return (
    <div className={`spinner spinner-${size} ${className || ""}`}>
      <div className="spinner-animation"></div>
    </div>
  );
};

export default Spinner;
