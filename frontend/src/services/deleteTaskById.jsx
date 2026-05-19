import api from "./api";

export const deleteTaskById = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/delete/${taskId}`);
    return response.data;
  } catch (err) {
    console.error(`Error deleting task ${taskId}:`, err);
    throw err;
  }
};