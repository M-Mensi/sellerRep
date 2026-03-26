import api from "./axios";

export const submitEmployee = (data) => api.post("/employees", data);

export const getMyEmployee = () => api.get("/employees/mine");

export const getAllEmployees = () => api.get("/employees");

export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
