import api from "./api";

export const updateTaskById = async (taskId, taskData) => {
  try {
    // taskData format: { userId, title, description, durationMinutes }
    const response = await api.put(`/tasks/update/${taskId}`, taskData);
    return response.data;
  } catch (err) {
    console.error(`Error updating task ${taskId}:`, err);
    throw err;
  }
};