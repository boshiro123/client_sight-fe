import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import "./TouristProfile.css"

const TouristProfile = () => {
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
        if (user.role !== "TOURIST") {
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
    <div className="profile-page">
      <Header />

      <main className="profile-main">
        <div className="profile-container">
          <h1 className="profile-title">Личный кабинет туриста</h1>

          {isLoading ? (
            <div className="profile-loading">Загрузка данных...</div>
          ) : error ? (
            <div className="profile-error">{error}</div>
          ) : userData ? (
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-header">
                  <h2>Информация о пользователе</h2>
                </div>
                <div className="profile-body">
                  <div className="profile-field">
                    <span className="field-label">Имя:</span>
                    <span className="field-value">{userData.fullName}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{userData.email}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Роль:</span>
                    <span className="field-value">Турист</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Дата регистрации:</span>
                    <span className="field-value">
                      {new Date(userData.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <h2>Мои бронирования</h2>
                </div>
                <div className="profile-body">
                  <p className="no-bookings">У вас пока нет бронирований.</p>
                </div>
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <h2>Избранное</h2>
                </div>
                <div className="profile-body">
                  <p className="no-favorites">
                    У вас пока нет избранных туров.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-error">
              Не удалось загрузить данные пользователя.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TouristProfile
