import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import "./Application.css"

// Имитация получения данных с сервера (в реальном приложении данные будут получены через API)
import { mockTours } from "../Home/mockData"

const Application = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialTourId = queryParams.get("tourId")

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    tourId: initialTourId || "",
    notes: "",
  })

  const [availableTours, setAvailableTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Имитация загрузки доступных туров с сервера
    const fetchAvailableTours = () => {
      setTimeout(() => {
        // Фильтруем туры, у которых есть свободные места и регистрация не закрыта
        const tours = mockTours.filter(
          tour => tour.availableSlots > 0 && !tour.isRegistrationClosed
        )
        setAvailableTours(tours)
        setLoading(false)
      }, 500)
    }

    fetchAvailableTours()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Очищаем ошибку для поля при его изменении
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Валидация полного имени
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Пожалуйста, введите ваше полное имя"
    }

    // Валидация телефона
    const phoneRegex = /^\+?[0-9\s-()]{10,15}$/
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Пожалуйста, введите ваш номер телефона"
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Пожалуйста, введите корректный номер телефона"
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Пожалуйста, введите ваш email"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Пожалуйста, введите корректный email адрес"
    }

    // Валидация выбора тура
    if (!formData.tourId) {
      newErrors.tourId = "Пожалуйста, выберите тур"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (validateForm()) {
      // Имитация отправки данных формы на сервер
      console.log("Submitting application:", formData)

      // Здесь будет код для отправки данных на сервер
      setTimeout(() => {
        setSubmitted(true)
        // После успешной отправки можно очистить форму
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          tourId: "",
          notes: "",
        })
      }, 1000)
    }
  }

  // После успешной отправки показываем сообщение об успехе
  if (submitted) {
    return (
      <div className="application-page">
        <Header />
        <main className="application-main">
          <div className="container">
            <div className="success-message">
              <h2>Ваша заявка успешно отправлена!</h2>
              <p>
                Спасибо за ваш интерес к нашим турам. Наш менеджер свяжется с
                вами в ближайшее время для подтверждения и предоставления
                дополнительной информации.
              </p>
              <div className="success-actions">
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-primary"
                >
                  Вернуться на главную
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false)
                  }}
                  className="btn btn-outline"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="application-page">
      <Header />
      <main className="application-main">
        <div className="container">
          <h1>Заявка на тур</h1>

          {loading ? (
            <div className="loading">Загрузка доступных туров...</div>
          ) : availableTours.length === 0 ? (
            <div className="no-tours">
              <p>К сожалению, в данный момент нет доступных туров.</p>
              <button onClick={() => navigate("/")} className="btn btn-primary">
                Вернуться на главную
              </button>
            </div>
          ) : (
            <div className="application-content">
              <div className="form-description">
                <h2>Оставьте заявку на тур</h2>
                <p>
                  Заполните форму заявки, и наш менеджер свяжется с вами в
                  ближайшее время для подтверждения и предоставления
                  дополнительной информации о выбранном туре.
                </p>
                <div className="form-note">
                  <p>
                    Все поля, отмеченные{" "}
                    <span className="required-mark">*</span>, являются
                    обязательными для заполнения.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Полное имя <span className="required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && (
                    <div className="error-message">{errors.fullName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Номер телефона <span className="required-mark">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+7 (___) ___-__-__"
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && (
                    <div className="error-message">{errors.phoneNumber}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required-mark">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tourId">
                    Выберите тур <span className="required-mark">*</span>
                  </label>
                  <select
                    id="tourId"
                    name="tourId"
                    value={formData.tourId}
                    onChange={handleChange}
                    className={errors.tourId ? "error" : ""}
                  >
                    <option value="">-- Выберите тур --</option>
                    {availableTours.map(tour => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name} (
                        {new Date(tour.startDate).toLocaleDateString("ru-RU")} -{" "}
                        {new Date(tour.endDate).toLocaleDateString("ru-RU")})
                      </option>
                    ))}
                  </select>
                  {errors.tourId && (
                    <div className="error-message">{errors.tourId}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Дополнительные пожелания</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Отправить заявку
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("/")}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Application
