import api from "./api";

export const getAllUsers = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    const response = await api.get(
      "/user/get-all"
    );

    console.log('this is res:', response)
    return response.data;
  } catch (err) {
    console.error("Could not register user");

    throw err;
  }
};