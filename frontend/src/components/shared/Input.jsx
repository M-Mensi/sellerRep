import React from "react";
import "../../styles/components.css";

export const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <div className={`input-wrapper ${className || ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={error ? "input-error" : ""}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
