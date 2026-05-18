import api from "./api";

export const registeruser = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    const response = await api.post(
      "/auth/register-user",
      userData
    );

    return response.data;
  } catch (err) {
    console.error("Could not register user");

    throw err;
  }
};
