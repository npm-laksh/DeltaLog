import LoginPage from "../pages/LoginPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserDashboardPage from "../pages/UserDashboardPage"
import { ErrorPage } from "../pages/ErrorPage"
import { ProtectedRoutes } from "./ProtectedRoutes"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}