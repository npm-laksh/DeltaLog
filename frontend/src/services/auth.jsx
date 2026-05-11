import api from "./api"

export async function loginApi(request) {
  const response = await api.post("auth/login", request)
  
  console.log("Login response:", response.data)

  return response.data
}