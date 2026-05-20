import api from "./api";

export const createNewTask = async (taskData) => {
  try {
    const response = await api.post("/tasks/create-task", taskData);
    return response.data;
  } catch (err) {
    console.error("Task creation endpoint failure:", err);
    throw err;
  }
};