import React from "react";
import "../../styles/components.css";

export const Card = ({ children, className, title, footer, onClick }) => {
  return (
    <div className={`card ${className || ""}`} onClick={onClick}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
