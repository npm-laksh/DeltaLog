import api from "./api";

export const deleteuser = async (username) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found");
      return;
    }

    const response = await api.delete(
        '/auth/delete-user', {
            data: {username: username}
        }
    );

    console.log('this is res:', response)
    return response.data;
  } catch (err) {
    console.error("Could not delete user");

    throw err;
  }
};
