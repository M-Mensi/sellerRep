import React from "react";
import "../../styles/components.css";

export const TextArea = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  className,
  ...props
}) => {
  return (
    <div className={`textarea-wrapper ${className || ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={error ? "textarea-error" : ""}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default TextArea;
