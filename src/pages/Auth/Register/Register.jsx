import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import "./Register.css"

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Если пользователь уже аутентифицирован, перенаправляем на соответствующую страницу
  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      if (AuthService.isAuthenticated()) {
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
          navigate("/")
        }
      }
    }

    redirectIfAuthenticated()
  }, [navigate])

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

    // Валидация имени пользователя
    if (!formData.username.trim()) {
      newErrors.username = "Пожалуйста, введите имя пользователя"
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Имя пользователя должно содержать не менее 3 символов"
    }

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = "Пожалуйста, введите ваш email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Пожалуйста, введите корректный email адрес"
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Пожалуйста, введите пароль"
    } else if (formData.password.length < 3) {
      newErrors.password = "Пароль должен содержать не менее 3 символов"
    }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Пожалуйста, подтвердите пароль"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    // Валидация согласия с условиями
    if (!formData.termsAccepted) {
      newErrors.termsAccepted =
        "Вы должны согласиться с условиями использования"
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
        // Вызываем метод регистрации из AuthService
        await AuthService.register(
          formData.username,
          formData.email,
          formData.password
        )

        // После успешной регистрации перенаправляем на страницу входа
        navigate("/login", {
          state: {
            message:
              "Регистрация прошла успешно! Теперь вы можете войти в свою учетную запись.",
          },
        })
      } catch (error) {
        console.error("Ошибка при регистрации:", error)
        // Обрабатываем возможные ошибки регистрации
        if (error.message.includes("email")) {
          setErrors({
            email: "Данный email уже зарегистрирован в системе",
          })
        } else {
          setErrors({
            register:
              "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.",
          })
        }
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
            <h1>Регистрация</h1>
            <p className="auth-description">
              Создайте учетную запись, чтобы получить доступ к
              персонализированным предложениям и удобному бронированию туров
            </p>

            {errors.register && (
              <div className="auth-error-message">{errors.register}</div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "error" : ""}
                  autoComplete="username"
                />
                {errors.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>

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
                  autoComplete="new-password"
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Подтверждение пароля</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="form-group-checkbox">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  <label htmlFor="termsAccepted">
                    Я принимаю{" "}
                    <Link to="/terms" className="auth-link">
                      условия использования
                    </Link>{" "}
                    и{" "}
                    <Link to="/privacy" className="auth-link">
                      политику конфиденциальности
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && (
                  <div className="error-message checkbox-error">
                    {errors.termsAccepted}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <div className="auth-alternate">
              <p>
                Уже есть учетная запись?{" "}
                <Link to="/login" className="auth-link">
                  Войти
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

export default Register
