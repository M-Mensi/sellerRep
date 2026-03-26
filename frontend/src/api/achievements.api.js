import api from "./axios";

export const submitAchievement = (data) => api.post("/achievements", data);

export const getMyAchievements = () => api.get("/achievements/mine");

export const getAllAchievements = () => api.get("/achievements");

export const updateAchievement = (id, data) =>
  api.put(`/achievements/${id}`, data);

export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);
