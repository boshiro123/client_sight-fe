import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import StatisticsService from "../../../services/StatisticsService"
import "./ManagerDashboard.css"

const ManagerDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statistics, setStatistics] = useState(null)
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
        if (user.role !== "MANAGER") {
          navigate("/")
          return
        }

        setUserData(user)

        // Получаем статистику
        const stats = await StatisticsService.getEmployeeStatistics()
        setStatistics(stats)
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
    <div className="manager-dashboard-page">
      <Header />

      <main className="manager-dashboard-main">
        <div className="manager-dashboard-container">
          <h1 className="manager-dashboard-title">
            Панель управления менеджера
          </h1>

          {isLoading ? (
            <div className="manager-dashboard-loading">Загрузка данных...</div>
          ) : error ? (
            <div className="manager-dashboard-error">{error}</div>
          ) : userData ? (
            <div className="manager-dashboard-content">
              <div className="manager-sidebar">
                <div className="manager-info">
                  <div className="manager-avatar">
                    <span>{userData.fullName.charAt(0)}</span>
                  </div>
                  <div className="manager-details">
                    <h3>{userData.fullName}</h3>
                    <p>{userData.email}</p>
                    <span className="manager-role">Менеджер</span>
                  </div>
                </div>

                <nav className="manager-nav">
                  <ul>
                    <li className="active">
                      <a href="#dashboard">Дашборд</a>
                    </li>
                    <li>
                      <a href="/employee/tours">Туры</a>
                    </li>
                    <li>
                      <a href="/employee/bookings">Бронирования</a>
                    </li>
                    <li>
                      <a href="/employee/clients">Пользователи</a>
                    </li>
                    <li>
                      <a href="/manager/analytics">Аналитика</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="manager-main-content">
                <div className="manager-welcome">
                  <h2>Добро пожаловать, {userData.fullName}!</h2>
                  <p>
                    Это ваша панель управления. Здесь вы можете просматривать
                    статистику, управлять сотрудниками и контролировать
                    бизнес-процессы.
                  </p>
                </div>

                <div className="manager-stats-row">
                  <div className="manager-stat-card">
                    <div className="stat-header">
                      <h3>Выручка</h3>
                    </div>
                    <div className="stat-body">
                      <div className="stat-value">₽0</div>
                      <div className="stat-label">За текущий месяц</div>
                    </div>
                  </div>

                  <div className="manager-stat-card">
                    <div className="stat-header">
                      <h3>Бронирования</h3>
                    </div>
                    <div className="stat-body">
                      <div className="stat-value">
                        {statistics?.applicationCount || 0}
                      </div>
                      <div className="stat-label">За текущий месяц</div>
                    </div>
                  </div>

                  <div className="manager-stat-card">
                    <div className="stat-header">
                      <h3>Клиенты</h3>
                    </div>
                    <div className="stat-body">
                      <div className="stat-value">
                        {statistics?.clientCount || 0}
                      </div>
                      <div className="stat-label">Всего клиентов</div>
                    </div>
                  </div>

                  <div className="manager-stat-card">
                    <div className="stat-header">
                      <h3>Туры</h3>
                    </div>
                    <div className="stat-body">
                      <div className="stat-value">
                        {statistics?.tourCount || 0}
                      </div>
                      <div className="stat-label">Активных туров</div>
                    </div>
                  </div>
                </div>

                <div className="manager-row">
                  <div className="manager-column">
                    <div className="manager-card">
                      <div className="card-header">
                        <h3>Последние заказы</h3>
                      </div>
                      <div className="card-body">
                        <p className="no-data">Нет данных для отображения</p>
                      </div>
                    </div>
                  </div>

                  <div className="manager-column">
                    <div className="manager-card">
                      <div className="card-header">
                        <h3>Сотрудники месяца</h3>
                      </div>
                      <div className="card-body">
                        <p className="no-data">Нет данных для отображения</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="manager-card">
                  <div className="card-header">
                    <h3>Статистика по турам</h3>
                  </div>
                  <div className="card-body">
                    <p className="no-data">Нет данных для отображения</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="manager-dashboard-error">
              Не удалось загрузить данные пользователя.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ManagerDashboard
