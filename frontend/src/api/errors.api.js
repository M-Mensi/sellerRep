import api from "./axios";

export const submitError = (data) => api.post("/errors", data);

export const getMyErrors = () => api.get("/errors/mine");

export const getAllErrors = () => api.get("/errors");

export const updateError = (id, data) => api.put(`/errors/${id}`, data);

export const deleteError = (id) => api.delete(`/errors/${id}`);
