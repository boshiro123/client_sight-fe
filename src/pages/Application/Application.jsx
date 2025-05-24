import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import * as TourService from "../../services/TourService"
import * as ApplicationService from "../../services/ApplicationService"
import * as AuthService from "../../services/AuthService"
import { AgeGroup, Gender } from "../../models/enums"
import "./Application.css"

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
    gender: "",
    ageGroup: "",
  })

  const [availableTours, setAvailableTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedTour, setSelectedTour] = useState(null)

  // Проверяем авторизацию и получаем данные пользователя
  useEffect(() => {}, [navigate, location])

  // Загружаем доступные туры
  useEffect(() => {
    const fetchAvailableTours = async () => {
      try {
        setLoading(true)
        const tours = await TourService.getAllTours()

        // Фильтруем туры, у которых есть свободные места и регистрация не закрыта
        const availableTours = tours.filter(
          tour => tour.availableSlots > 0 && !tour.isRegistrationClosed
        )

        setAvailableTours(availableTours)

        // Если есть initialTourId, заполняем данные о выбранном туре
        if (initialTourId) {
          const selectedTour = availableTours.find(
            tour => tour.id.toString() === initialTourId
          )
          if (selectedTour) {
            setSelectedTour(selectedTour)
          }
        }
      } catch (err) {
        console.error("Ошибка при загрузке туров:", err)
        setError(
          "Не удалось загрузить доступные туры. Пожалуйста, попробуйте позже."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableTours()
  }, [initialTourId])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Если изменился выбранный тур, обновляем selectedTour
    if (name === "tourId") {
      const tour = availableTours.find(t => t.id.toString() === value)
      setSelectedTour(tour || null)
    }

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

    // Валидация телефона для Беларуси
    const phoneRegex =
      /^\+375\s?\(?(17|29|33|44|25)\)?\s?\d{3}\-?\d{2}\-?\d{2}$/
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Пожалуйста, введите ваш номер телефона"
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Пожалуйста, введите корректный номер телефона в формате +375 (XX) XXX-XX-XX"
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

    // Валидация пола
    if (!formData.gender) {
      newErrors.gender = "Пожалуйста, укажите ваш пол"
    }

    // Валидация возрастной группы
    if (!formData.ageGroup) {
      newErrors.ageGroup = "Пожалуйста, укажите вашу возрастную группу"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setSubmitting(true)
        setError(null)

        // Создаем объект с данными заявки
        const applicationData = {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          tourId: parseInt(formData.tourId),
          gender: formData.gender,
          ageGroup: formData.ageGroup,
          status: "PENDING",
        }

        // Отправляем заявку на сервер
        const response = await ApplicationService.createApplication(
          applicationData
        )
        console.log("Application submitted successfully:", response)

        setSubmitted(true)
        // После успешной отправки очищаем форму
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          tourId: "",
          notes: "",
          gender: "",
          ageGroup: "",
        })
      } catch (err) {
        console.error("Ошибка при отправке заявки:", err)
        setError(
          "Не удалось отправить заявку. Пожалуйста, проверьте введенные данные и попробуйте снова."
        )
      } finally {
        setSubmitting(false)
      }
    }
  }

  // После успешной отправки показываем сообщение об успехе
  if (submitted) {
    return (
      <div className="application-page">
        <Header />
        <main className="application-main success-layout">
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

          {error && <div className="application-error">{error}</div>}

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
                    placeholder="+375 (XX) XXX-XX-XX"
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

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="gender">
                      Пол <span className="required-mark">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={errors.gender ? "error" : ""}
                    >
                      <option value="">Выберите пол</option>
                      <option value={Gender.MALE}>Мужской</option>
                      <option value={Gender.FEMALE}>Женский</option>
                      <option value={Gender.OTHER}>Другой</option>
                    </select>
                    {errors.gender && (
                      <div className="error-message">{errors.gender}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ageGroup">
                      Возрастная группа <span className="required-mark">*</span>
                    </label>
                    <select
                      id="ageGroup"
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleChange}
                      className={errors.ageGroup ? "error" : ""}
                    >
                      <option value="">Выберите возрастную группу</option>
                      <option value={AgeGroup.UNDER_18}>До 18 лет</option>
                      <option value={AgeGroup.AGE_18_20}>18-20 лет</option>
                      <option value={AgeGroup.AGE_21_25}>21-25 лет</option>
                      <option value={AgeGroup.AGE_26_35}>26-35 лет</option>
                      <option value={AgeGroup.AGE_36_50}>36-50 лет</option>
                      <option value={AgeGroup.OVER_50}>Старше 50 лет</option>
                    </select>
                    {errors.ageGroup && (
                      <div className="error-message">{errors.ageGroup}</div>
                    )}
                  </div>
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
                    <option value="">Выберите тур</option>
                    {availableTours.map(tour => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name} ({tour.country})
                      </option>
                    ))}
                  </select>
                  {errors.tourId && (
                    <div className="error-message">{errors.tourId}</div>
                  )}
                </div>

                {selectedTour && (
                  <div className="selected-tour-info">
                    <h3>Информация о выбранном туре</h3>
                    <div className="tour-info-grid">
                      <div className="info-row">
                        <span className="info-label">Страна:</span>
                        <span className="info-value">
                          {selectedTour.country}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Даты:</span>
                        <span className="info-value">
                          {new Date(selectedTour.startDate).toLocaleDateString(
                            "ru-RU"
                          )}{" "}
                          -{" "}
                          {new Date(selectedTour.endDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Свободные места:</span>
                        <span className="info-value">
                          {selectedTour.availableSlots}/
                          {selectedTour.totalSlots}
                        </span>
                      </div>
                      {selectedTour.price && (
                        <div className="info-row">
                          <span className="info-label">Цена:</span>
                          <span className="info-value price">
                            {new Intl.NumberFormat("ru-RU", {
                              style: "currency",
                              currency: "BYN",
                              maximumFractionDigits: 0,
                            }).format(selectedTour.price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="btn btn-outline"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Отправка..." : "Отправить заявку"}
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
