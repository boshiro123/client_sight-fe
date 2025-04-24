import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import "./EmployeeDashboard.css"

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Проверяем, авторизован ли пользователь
        if (!AuthService.isAuthenticated()) {
          navigate("/login")
          return
        }

        // Получаем данные пользователя
        const user = await AuthService.getCurrentUser()

        // Проверяем роль пользователя
        if (user.role !== "EMPLOYEE") {
          navigate("/")
          return
        }

        setUserData(user)
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error)
        setError(
          "Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Панель управления сотрудника</h1>

          {isLoading ? (
            <div className="dashboard-loading">Загрузка данных...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : userData ? (
            <div className="dashboard-content">
              <div className="dashboard-sidebar">
                <div className="user-info">
                  <div className="user-avatar">
                    <span>{userData.fullName.charAt(0)}</span>
                  </div>
                  <div className="user-details">
                    <h3>{userData.fullName}</h3>
                    <p>{userData.email}</p>
                    <span className="user-role">Сотрудник</span>
                  </div>
                </div>

                <nav className="dashboard-nav">
                  <ul>
                    <li className="active">
                      <a href="#overview">Обзор</a>
                    </li>
                    <li>
                      <a href="/employee/tours">Туры</a>
                    </li>
                    <li>
                      <a href="/employee/bookings">Бронирования</a>
                    </li>
                    <li>
                      <a href="#clients">Клиенты</a>
                    </li>
                    <li>
                      <a href="#reports">Отчеты</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="dashboard-main-content">
                <div className="dashboard-welcome">
                  <h2>Добро пожаловать, {userData.fullName}!</h2>
                  <p>
                    Это ваша панель управления. Здесь вы можете управлять
                    турами, бронированиями и клиентами.
                  </p>
                </div>

                <div className="dashboard-overview">
                  <div className="stat-card">
                    <h3>Активные туры</h3>
                    <div className="stat-value">0</div>
                  </div>

                  <div className="stat-card">
                    <h3>Бронирования</h3>
                    <div className="stat-value">0</div>
                  </div>

                  <div className="stat-card">
                    <h3>Клиенты</h3>
                    <div className="stat-value">0</div>
                  </div>

                  <div className="stat-card">
                    <h3>Отзывы</h3>
                    <div className="stat-value">0</div>
                  </div>
                </div>

                <div className="dashboard-section">
                  <div className="section-header">
                    <h3>Последние действия</h3>
                  </div>
                  <div className="section-content">
                    <p className="no-data">Нет данных для отображения</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-error">
              Не удалось загрузить данные пользователя.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EmployeeDashboard
