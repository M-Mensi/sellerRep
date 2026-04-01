import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now();
      const notification = { id, message, type, duration };
      setNotifications((prev) => [...prev, notification]);
      return id;
    },
    [],
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const success = useCallback(
    (message, duration = 3000) => {
      return addNotification(message, "success", duration);
    },
    [addNotification],
  );

  const error = useCallback(
    (message, duration = 4000) => {
      return addNotification(message, "error", duration);
    },
    [addNotification],
  );

  const warning = useCallback(
    (message, duration = 3000) => {
      return addNotification(message, "warning", duration);
    },
    [addNotification],
  );

  const info = useCallback(
    (message, duration = 3000) => {
      return addNotification(message, "info", duration);
    },
    [addNotification],
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
};

export default useNotifications;
