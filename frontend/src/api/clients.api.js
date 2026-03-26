import api from "./axios";

export const submitClient = (data) => api.post("/clients", data);

export const getMyClients = () => api.get("/clients/mine");

export const getAllClients = () => api.get("/clients");

export const updateClient = (id, data) => api.put(`/clients/${id}`, data);

export const deleteClient = (id) => api.delete(`/clients/${id}`);
