import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import * as UserService from "../../../services/UserService"
import * as ApplicationService from "../../../services/ApplicationService"
import {
  AgeGroup,
  Gender,
  TourType,
  ApplicationStatus,
} from "../../../models/enums"
import "./TouristProfile.css"

const TouristProfile = () => {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    ageGroup: "",
    preferredTourType: "",
    additionalInfo: "",
  })
  const [applications, setApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
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
        // Предзаполняем форму данными пользователя
        setFormData({
          fullName: user.fullName || "",
          phoneNumber:
            user.contact.phoneNumber !== "Не указан"
              ? user.contact.phoneNumber
              : "",
          gender: user.contact.gender || "",
          ageGroup: user.contact.ageGroup || "",
          preferredTourType: user.contact.preferredTourType || "",
          additionalInfo: user.contact.additionalInfo || "",
        })

        // Загружаем заявки пользователя
        fetchUserApplications(user.email)
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

  const fetchUserApplications = async email => {
    try {
      setLoadingApplications(true)
      const apps = await ApplicationService.getApplicationsByEmail(email)
      setApplications(apps)
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error)
    } finally {
      setLoadingApplications(false)
    }
  }

  const handleCancelApplication = async applicationId => {
    try {
      // Вместо удаления заявки меняем её статус на CANCELLED
      await ApplicationService.updateApplicationStatus(
        applicationId,
        "CANCELLED"
      )

      // Показываем сообщение об успешной отмене
      setSuccessMessage("Заявка успешно отменена")
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)

      // Обновляем список заявок после отмены
      if (userData) {
        fetchUserApplications(userData.email)
      }
    } catch (error) {
      console.error("Ошибка при отмене заявки:", error)
      setError("Не удалось отменить заявку. Пожалуйста, попробуйте позже.")
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Возвращаем исходные данные при отмене редактирования
    setFormData({
      fullName: userData?.fullName || "",
      phoneNumber:
        userData?.phoneNumber !== "Не указан" ? userData.phoneNumber : "",
      gender: userData?.gender || "",
      ageGroup: userData?.ageGroup || "",
      preferredTourType: userData?.preferredTourType || "",
      additionalInfo: userData?.additionalInfo || "",
    })
    setIsEditing(false)
    setSuccessMessage("")
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // Вызываем API для обновления профиля
      const updatedUser = await UserService.updateProfile(formData)

      setUserData(updatedUser)
      setIsEditing(false)
      setSuccessMessage("Профиль успешно обновлен")

      // Сбрасываем сообщение об успешном обновлении через 3 секунды
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error)
      setError("Не удалось обновить профиль. Пожалуйста, попробуйте позже.")
    } finally {
      setIsSaving(false)
    }
  }

  const getGenderText = gender => {
    switch (gender) {
      case Gender.MALE:
        return "Мужской"
      case Gender.FEMALE:
        return "Женский"
      case Gender.OTHER:
        return "Другой"
      default:
        return "Не указан"
    }
  }

  const getAgeGroupText = ageGroup => {
    switch (ageGroup) {
      case AgeGroup.UNDER_18:
        return "До 18 лет"
      case AgeGroup.AGE_18_20:
        return "18-20 лет"
      case AgeGroup.AGE_21_25:
        return "21-25 лет"
      case AgeGroup.AGE_26_35:
        return "26-35 лет"
      case AgeGroup.AGE_36_50:
        return "36-50 лет"
      case AgeGroup.OVER_50:
        return "Старше 50 лет"
      default:
        return "Не указана"
    }
  }

  const getTourTypeText = tourType => {
    switch (tourType) {
      case TourType.BEACH:
        return "Пляжный отдых"
      case TourType.EXCURSION:
        return "Экскурсионный"
      case TourType.ADVENTURE:
        return "Приключение"
      case TourType.SKIING:
        return "Горнолыжный"
      case TourType.CRUISE:
        return "Круиз"
      case TourType.CULTURAL:
        return "Культурный"
      case TourType.MEDICAL:
        return "Оздоровительный"
      case TourType.EDUCATIONAL:
        return "Образовательный"
      default:
        return "Не указан"
    }
  }

  const getStatusText = status => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "В ожидании"
      case ApplicationStatus.APPROVED:
        return "Подтверждена"
      case ApplicationStatus.REJECTED:
        return "Отклонена"
      case ApplicationStatus.CANCELLED:
        return "Отменена"
      default:
        return "Неизвестно"
    }
  }

  const getStatusClass = status => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "status-pending"
      case ApplicationStatus.APPROVED:
        return "status-approved"
      case ApplicationStatus.REJECTED:
        return "status-rejected"
      case ApplicationStatus.CANCELLED:
        return "status-cancelled"
      default:
        return ""
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const handleTourDetails = tourId => {
    navigate(`/tours/${tourId}`)
  }

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
                  {!isEditing && (
                    <button className="edit-button" onClick={handleEditClick}>
                      Редактировать
                    </button>
                  )}
                </div>

                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}

                {isEditing ? (
                  <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="fullName">ФИО</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">Номер телефона</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+375 (XX) XXX-XX-XX"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        disabled
                        className="disabled-input"
                      />
                      <span className="field-hint">Email нельзя изменить</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Пол</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите пол</option>
                        <option value={Gender.MALE}>Мужской</option>
                        <option value={Gender.FEMALE}>Женский</option>
                        <option value={Gender.OTHER}>Другой</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ageGroup">Возрастная группа</label>
                      <select
                        id="ageGroup"
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите возрастную группу</option>
                        <option value={AgeGroup.UNDER_18}>До 18 лет</option>
                        <option value={AgeGroup.AGE_18_20}>18-20 лет</option>
                        <option value={AgeGroup.AGE_21_25}>21-25 лет</option>
                        <option value={AgeGroup.AGE_26_35}>26-35 лет</option>
                        <option value={AgeGroup.AGE_36_50}>36-50 лет</option>
                        <option value={AgeGroup.OVER_50}>Старше 50 лет</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferredTourType">
                        Предпочитаемый тип тура
                      </label>
                      <select
                        id="preferredTourType"
                        name="preferredTourType"
                        value={formData.preferredTourType}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите тип тура</option>
                        <option value={TourType.BEACH}>Пляжный отдых</option>
                        <option value={TourType.EXCURSION}>
                          Экскурсионный
                        </option>
                        <option value={TourType.ADVENTURE}>Приключение</option>
                        <option value={TourType.SKIING}>Горнолыжный</option>
                        <option value={TourType.CRUISE}>Круиз</option>
                        <option value={TourType.CULTURAL}>Культурный</option>
                        <option value={TourType.MEDICAL}>
                          Оздоровительный
                        </option>
                        <option value={TourType.EDUCATIONAL}>
                          Образовательный
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="additionalInfo">
                        Дополнительная информация
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Здесь вы можете указать дополнительные пожелания или информацию"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={handleCancelEdit}
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="save-button"
                        disabled={isSaving}
                      >
                        {isSaving ? "Сохранение..." : "Сохранить"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-body">
                    <div className="profile-field">
                      <span className="field-label">ФИО:</span>
                      <span className="field-value">{userData.fullName}</span>
                    </div>
                    <div className="profile-field">
                      <span className="field-label">Email:</span>
                      <span className="field-value">{userData.email}</span>
                    </div>
                    <div className="profile-field">
                      <span className="field-label">Телефон:</span>
                      <span className="field-value">
                        {userData.phoneNumber}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="field-label">Пол:</span>
                      <span className="field-value">
                        {getGenderText(userData.contact.gender)}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="field-label">Возрастная группа:</span>
                      <span className="field-value">
                        {getAgeGroupText(userData.contact.ageGroup)}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="field-label">
                        Предпочитаемый тип тура:
                      </span>
                      <span className="field-value">
                        {userData.contact.preferredTourType
                          ? getTourTypeText(userData.contact.preferredTourType)
                          : "Не указан"}
                      </span>
                    </div>
                    {userData.additionalInfo && (
                      <div className="profile-field">
                        <span className="field-label">
                          Дополнительная информация:
                        </span>
                        <span className="field-value">
                          {userData.contact.additionalInfo}
                        </span>
                      </div>
                    )}
                    <div className="profile-field">
                      <span className="field-label">Роль:</span>
                      <span className="field-value">Турист</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-card">
                <div className="profile-header">
                  <h2>Мои бронирования</h2>
                </div>
                <div className="profile-body">
                  {loadingApplications ? (
                    <div className="loading-applications">
                      Загрузка заявок...
                    </div>
                  ) : applications.length === 0 ? (
                    <p className="no-bookings">У вас пока нет бронирований.</p>
                  ) : (
                    <div className="applications-list">
                      {applications.map(application => (
                        <div key={application.id} className="application-item">
                          <div className="application-header">
                            <div className="application-tour-name">
                              {application.tour.name}
                            </div>
                            <div
                              className={`application-status ${getStatusClass(
                                application.status
                              )}`}
                            >
                              {getStatusText(application.status)}
                            </div>
                          </div>

                          <div className="application-details">
                            <div className="application-info">
                              <div className="info-row">
                                <span className="info-label">Страна:</span>
                                <span className="info-value">
                                  {application.tour.country}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Даты:</span>
                                <span className="info-value">
                                  {formatDate(application.tour.startDate)} -{" "}
                                  {formatDate(application.tour.endDate)}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">
                                  Продолжительность:
                                </span>
                                <span className="info-value">
                                  {application.tour.duration} дней
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">
                                  Статус заявки:
                                </span>
                                <span className="info-value">
                                  {getStatusText(application.status)}
                                </span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Дата заявки:</span>
                                <span className="info-value">
                                  {formatDate(application.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="application-actions">
                              <button
                                className="btn-tour-details"
                                onClick={() =>
                                  handleTourDetails(application.tour.id)
                                }
                              >
                                Подробнее о туре
                              </button>

                              {application.status ===
                                ApplicationStatus.PENDING && (
                                <button
                                  className="btn-cancel-application"
                                  onClick={() =>
                                    handleCancelApplication(application.id)
                                  }
                                >
                                  Отменить заявку
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
