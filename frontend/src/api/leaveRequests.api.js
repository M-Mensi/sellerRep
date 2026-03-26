import api from "./axios";

export const submitLeaveRequest = (data) => api.post("/leave-requests", data);

export const getMyLeaveRequests = () => api.get("/leave-requests/mine");

export const getAllLeaveRequests = () => api.get("/leave-requests");

export const updateLeaveRequest = (id, data) =>
  api.put(`/leave-requests/${id}`, data);

export const deleteLeaveRequest = (id) => api.delete(`/leave-requests/${id}`);
