import React from "react";
import "../../styles/components.css";

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  type = "button",
  className,
  ...props
}) => {
  const btnClass = `btn btn-${variant} btn-${size} ${className || ""}`;

  return (
    <button
      type={type}
      className={btnClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
