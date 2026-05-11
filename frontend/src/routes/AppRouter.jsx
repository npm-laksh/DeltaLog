import LoginPage from "../pages/LoginPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserDashboardPage from "../pages/UserDashboardPage"
import { ErrorPage } from "../pages/ErrorPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}