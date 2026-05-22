import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== "ADMIN") return <Navigate to="/user-dashboard" replace />;

  return <Outlet />; 
}
