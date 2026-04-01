import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing localStorage
 * @param {String} key - Local storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (valueToStore === null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
};

export default useLocalStorage;
