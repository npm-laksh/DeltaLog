import api from "./api"

export async function loginApi(email, password) {
  const response = await api.post("auth/login", {
    email,
    password,
  })
  console.log("Login response:", response.data)

  return response.data
}