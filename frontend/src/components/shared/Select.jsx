import React from "react";
import "../../styles/components.css";

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder,
  required = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <div className={`select-wrapper ${className || ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={error ? "select-error" : ""}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;
