import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for fetching data with loading and error states
 * @param {Function|String} fetchFn - Fetch function or URL
 * @param {Array} dependencies - Dependencies array for re-fetching
 * @param {Object} options - Options like skip, delay, etc.
 */
export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (options.skip) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (typeof fetchFn === "string") {
        const response = await fetch(fetchFn);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        result = await response.json();
      } else {
        result = await fetchFn();
      }

      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || "An error occurred");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, options.skip]);

  useEffect(() => {
    if (options.delay) {
      const timer = setTimeout(fetchData, options.delay);
      return () => clearTimeout(timer);
    }
    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
