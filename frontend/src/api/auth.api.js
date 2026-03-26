import api from "./axios";

export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};
