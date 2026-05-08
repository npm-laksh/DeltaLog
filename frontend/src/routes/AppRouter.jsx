import LoginPage from "../pages/LoginPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}