import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Application from "./pages/Application"
import { Login, Register } from "./pages/Auth"
import TouristProfile from "./pages/Tourist/Profile"
import EmployeeDashboard from "./pages/Employee/Dashboard"
import ManagerDashboard from "./pages/Manager/Dashboard"
import EmployeeTours from "./pages/Employee/Tours"
import EmployeeBookings from "./pages/Employee/Bookings"
import EmployeeClients from "./pages/Employee/Clients"
import ApplicationDetail from "./pages/Employee/Bookings/ApplicationDetail"
import TourPage from "./pages/Tour"
// import EmployeeApplications from "./pages/Employee/Applications"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/application" element={<Application />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tours/:id" element={<TourPage />} />

        {/* Маршруты для профилей пользователей разных ролей */}
        <Route path="/tourist/profile" element={<TouristProfile />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/employee/tours" element={<EmployeeTours />} />
        <Route path="/employee/bookings" element={<EmployeeBookings />} />
        <Route path="/employee/clients" element={<EmployeeClients />} />
        <Route
          path="/employee/applications/:id"
          element={<ApplicationDetail />}
        />

        {/* Дополнительные маршруты будут добавлены позже */}
      </Routes>
    </Router>
  )
}

export default App
