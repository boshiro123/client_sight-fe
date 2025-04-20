import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Получаем сообщение об успешной регистрации, если оно есть
  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message)
      // Очищаем state, чтобы сообщение не появлялось при обновлении страницы
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Если пользователь уже аутентифицирован, перенаправляем на соответствующую страницу
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      redirectUserBasedOnRole()
    }
  }, [navigate])

  // Функция для перенаправления пользователя в зависимости от роли
  const redirectUserBasedOnRole = async () => {
    try {
      const userData = await AuthService.getCurrentUser()

      switch (userData.role) {
        case "TOURIST":
          navigate("/tourist/profile")
          break
        case "EMPLOYEE":
          navigate("/employee/dashboard")
          break
        case "MANAGER":
          navigate("/manager/dashboard")
          break
        default:
          navigate("/")
          break
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error)
      // Если не удалось получить данные пользователя, перенаправляем на главную
      navigate("/")
    }
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === "checkbox" ? checked : value

    setFormData({
      ...formData,
      [name]: fieldValue,
    })

    // Очищаем ошибки при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = "Пожалуйста, введите ваш email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Пожалуйста, введите корректный email адрес"
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Пожалуйста, введите ваш пароль"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      setErrors({})

      try {
        // Вызываем метод авторизации из AuthService
        await AuthService.login(formData.email, formData.password)

        // После успешной авторизации перенаправляем пользователя в зависимости от его роли
        await redirectUserBasedOnRole()
      } catch (error) {
        console.error("Ошибка при авторизации:", error)
        setErrors({
          auth: "Неверный email или пароль. Пожалуйста, попробуйте снова.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-content">
            <h1>Вход в учетную запись</h1>
            <p className="auth-description">
              Войдите в свою учетную запись, чтобы получить доступ к
              дополнительным возможностям и персональным предложениям
            </p>

            {successMessage && (
              <div className="auth-success-message">{successMessage}</div>
            )}

            {errors.auth && (
              <div className="auth-error-message">{errors.auth}</div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group-inline">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Запомнить меня</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Забыли пароль?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Вход..." : "Войти"}
              </button>
            </form>

            <div className="auth-alternate">
              <p>
                Нет учетной записи?{" "}
                <Link to="/register" className="auth-link">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login
