import api from "./api";

export const updateUser = async (updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    // updatedData will look like: { id, username, email, role, password }
    const response = await api.put("/user/update", updatedData);
    return response.data;
  } catch (err) {
    console.error("Could not update user info", err);
    throw err;
  }
};