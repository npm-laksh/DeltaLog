import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";
import UserDashboardPage from "../pages/UserDashboardPage";
import ErrorPage from "../pages/ErrorPage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import ManageUsers from "../pages/ManageUsers";
import AdminRoute from "../routes/AdminRoute";

export default function AppRouter() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/user-dashboard" /> : <LoginPage />}
        />

        <Route
          path="/login"
          element={isAuth ? <Navigate to="/user-dashboard" /> : <LoginPage />}
        />

        <Route path="*" element={<ErrorPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/user-dashboard" element={<UserDashboardPage />} />

          <Route element={<AdminRoute />}>
            {/* add admin paths here */}
            <Route path="/manage-user" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
