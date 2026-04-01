/**
 * API Error handling utilities
 */

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Parse API error response
 * @param {Error|Object} error - Error object or response data
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";

  // Axios error
  if (error.response) {
    const { status, data } = error.response;

    // Server returned error message
    if (data && data.message) {
      return data.message;
    }

    // Handle by status code
    switch (status) {
      case 400:
        return data?.error || "Invalid request. Please check your input.";
      case 401:
        return "You are not authenticated. Please login again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This resource already exists.";
      case 422:
        return data?.error || "Validation error. Please check your input.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Error: ${status}. Please try again.`;
    }
  }

  // Network error
  if (error.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  // Generic error message
  return error.message || "An unknown error occurred";
};

/**
 * Handle validation errors from API
 * @param {Object} error - Error object from API
 * @returns {Object} - Field-level errors
 */
export const getFieldErrors = (error) => {
  const fieldErrors = {};

  if (!error.response) return fieldErrors;

  const { data } = error.response;

  // Handle validation errors
  if (data && data.errors && Array.isArray(data.errors)) {
    data.errors.forEach((err) => {
      fieldErrors[err.field || "general"] = err.message;
    });
  } else if (data && typeof data.errors === "object") {
    Object.assign(fieldErrors, data.errors);
  }

  return fieldErrors;
};

/**
 * Check if error is authentication error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * Check if error is validation error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error?.response?.status === 422 || error?.response?.status === 400;
};

export default {
  APIError,
  getErrorMessage,
  getFieldErrors,
  isAuthError,
  isValidationError,
};
