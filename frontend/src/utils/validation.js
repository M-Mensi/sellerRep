/**
 * Common validation utilities for forms
 */

export const validators = {
  // Email validation
  email: (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Invalid email address";
  },

  // Required field validation
  required: (value, fieldName = "This field") => {
    return value && value.trim() ? "" : `${fieldName} is required`;
  },

  // Minimum length validation
  minLength: (value, length, fieldName = "This field") => {
    if (!value) return "";
    return value.length >= length
      ? ""
      : `${fieldName} must be at least ${length} characters`;
  },

  // Maximum length validation
  maxLength: (value, length, fieldName = "This field") => {
    if (!value) return "";
    return value.length <= length
      ? ""
      : `${fieldName} must not exceed ${length} characters`;
  },

  // Number validation
  number: (value) => {
    if (!value) return "";
    return !isNaN(value) ? "" : "Must be a valid number";
  },

  // Phone number validation
  phone: (value) => {
    if (!value) return "";
    const phoneRegex = /^[0-9\-\+\(\)\s]*$/;
    return phoneRegex.test(value) && value.length >= 10
      ? ""
      : "Invalid phone number";
  },

  // URL validation
  url: (value) => {
    if (!value) return "";
    try {
      new URL(value);
      return "";
    } catch {
      return "Invalid URL";
    }
  },

  // Password strength validation
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value))
      return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain a number";
    return "";
  },
};

/**
 * Batch validation for forms
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema { fieldName: [validators] }
 * @returns {Object} - Errors object
 */
export const validateForm = (values, schema) => {
  const errors = {};

  Object.keys(schema).forEach((fieldName) => {
    const fieldValidators = schema[fieldName];
    for (let validator of fieldValidators) {
      const error = validator(values[fieldName]);
      if (error) {
        errors[fieldName] = error;
        break;
      }
    }
  });

  return errors;
};

export default validators;
