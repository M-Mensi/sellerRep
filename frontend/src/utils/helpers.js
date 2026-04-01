/**
 * Common utility functions
 */

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or string
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d)) return "";

  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    full: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return d.toLocaleDateString("en-US", options[format] || options.short);
};

/**
 * Format time to HH:MM AM/PM
 * @param {Date|string} date - Date object or string
 * @returns {string} - Formatted time
 */
export const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d)) return "";

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (value, currency = "USD") => {
  if (value === null || value === undefined) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated string
 */
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + "...";
};

/**
 * Capitalize string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert snake_case to Title Case
 * @param {string} str - String in snake_case
 * @returns {string} - Title case string
 */
export const snakeCaseToTitle = (str) => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} - Throttled function
 */
export const throttle = (fn, delay = 300) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Get unique values from array
 * @param {Array} arr - Array to process
 * @returns {Array} - Array with unique values
 */
export const unique = (arr) => {
  return [...new Set(arr)];
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

export default {
  formatDate,
  formatTime,
  formatCurrency,
  truncate,
  capitalize,
  snakeCaseToTitle,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  unique,
  groupBy,
};
