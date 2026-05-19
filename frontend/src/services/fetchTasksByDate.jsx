import api from "./api";

export const getTasksByDate = async (dateString) => {
  try {
    // date string format -> YYYY-MM-DD
    const response = await api.get(`/tasks/date?date=${dateString}`);
    return response.data;

  } catch (err) {
    console.error("Could not fetch tasks for the specified date:", err);
    throw err;
  }
};