import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Application from "./pages/Application"
import { Login, Register } from "./pages/Auth"
import TouristProfile from "./pages/Tourist/Profile"
import EmployeeDashboard from "./pages/Employee/Dashboard"
import ManagerDashboard from "./pages/Manager/Dashboard"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/application" element={<Application />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Маршруты для профилей пользователей разных ролей */}
        <Route path="/tourist/profile" element={<TouristProfile />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* Дополнительные маршруты будут добавлены позже */}
      </Routes>
    </Router>
  )
}

export default App
