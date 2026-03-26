import api from "./axios";

export const submitDailyTracker = (data) => api.post("/daily-tracker", data);

export const getMyDailyTracker = () => api.get("/daily-tracker/mine");

export const getAllDailyTracker = () => api.get("/daily-tracker");
