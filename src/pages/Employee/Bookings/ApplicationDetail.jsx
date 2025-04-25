import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as ApplicationService from "../../../services/ApplicationService"
import { ApplicationStatus, Gender, AgeGroup } from "../../../models/enums"
import "./ApplicationDetail.css"

const ApplicationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true)
        const data = await ApplicationService.getApplicationById(id)
        setApplication(data)
        setError(null)
        console.log(data)
      } catch (err) {
        console.error("Ошибка при загрузке заявки:", err)
        setError(
          "Не удалось загрузить данные заявки. Пожалуйста, попробуйте позже."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationDetail()
  }, [id])

  const getStatusText = status => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "В ожидании"
      case ApplicationStatus.APPROVED:
        return "Одобрена"
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

  const updateApplicationStatus = async newStatus => {
    try {
      setUpdating(true)
      setUpdateSuccess(false)

      // Используем метод из ApplicationService для обновления статуса
      const updatedApplication =
        await ApplicationService.updateApplicationStatus(id, newStatus)

      // Обновляем состояние с новыми данными
      setApplication(updatedApplication)
      setUpdateSuccess(true)
    } catch (err) {
      console.error("Ошибка при обновлении статуса заявки:", err)
      setError(
        "Не удалось обновить статус заявки. Пожалуйста, попробуйте позже."
      )
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="application-detail-page">
      <Helmet>
        <title>Детали заявки | Панель сотрудника</title>
      </Helmet>

      <Header />

      <main className="application-detail-main">
        <div className="detail-container">
          <div className="detail-header">
            <button
              className="back-button"
              onClick={() => navigate("/employee/bookings")}
            >
              &larr; Назад к списку
            </button>
            <h1>Детали заявки</h1>
          </div>

          {loading ? (
            <div className="loading-spinner">Загрузка данных заявки...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : application ? (
            <div className="application-detail-content">
              <div className="detail-section application-header">
                <div className="application-id-section">
                  <h2>Заявка #{application.id}</h2>
                  <span
                    className={`application-status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {getStatusText(application.status)}
                  </span>
                </div>
                <div className="application-dates">
                  <p>
                    Создана:{" "}
                    {new Date(application.createdAt).toLocaleString("ru-RU")}
                  </p>
                  {application.updatedAt !== application.createdAt && (
                    <p>
                      Обновлена:{" "}
                      {new Date(application.updatedAt).toLocaleString("ru-RU")}
                    </p>
                  )}
                </div>
              </div>

              <div className="detail-section tour-details">
                <h3>Информация о туре</h3>
                {application.tour ? (
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="detail-label">Название:</span>
                      <span className="detail-value">
                        {application.tour.name}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Страна:</span>
                      <span className="detail-value">
                        {application.tour.country}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Даты:</span>
                      <span className="detail-value">
                        {new Date(
                          application.tour.startDate
                        ).toLocaleDateString("ru-RU")}{" "}
                        -
                        {new Date(application.tour.endDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Длительность:</span>
                      <span className="detail-value">
                        {application.tour.duration} дней
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Тип:</span>
                      <span className="detail-value">
                        {application.tour.type}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Свободных мест:</span>
                      <span className="detail-value">
                        {application.tour.availableSlots}/
                        {application.tour.totalSlots}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="no-data">Информация о туре недоступна</p>
                )}
              </div>

              <div className="detail-section client-details">
                <h3>Информация о клиенте</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">ФИО:</span>
                    <span className="detail-value">{application.fullName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{application.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Телефон:</span>
                    <span className="detail-value">
                      {application.contact.phoneNumber}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Пол:</span>
                    <span className="detail-value">
                      {getGenderText(application.contact.gender)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Возраст:</span>
                    <span className="detail-value">
                      {getAgeGroupText(application.contact.ageGroup)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section status-management">
                <h3>Управление статусом</h3>

                {updateSuccess && (
                  <div className="success-message">
                    Статус заявки успешно обновлен!
                  </div>
                )}

                <div className="status-buttons">
                  <button
                    className={`status-button approve-button ${
                      application.status === ApplicationStatus.APPROVED
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      updateApplicationStatus(ApplicationStatus.APPROVED)
                    }
                    disabled={
                      updating ||
                      application.status === ApplicationStatus.APPROVED
                    }
                  >
                    {updating &&
                    application.status !== ApplicationStatus.APPROVED
                      ? "Обработка..."
                      : "Одобрить"}
                  </button>

                  <button
                    className={`status-button reject-button ${
                      application.status === ApplicationStatus.REJECTED
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      updateApplicationStatus(ApplicationStatus.REJECTED)
                    }
                    disabled={
                      updating ||
                      application.status === ApplicationStatus.REJECTED
                    }
                  >
                    {updating &&
                    application.status !== ApplicationStatus.REJECTED
                      ? "Обработка..."
                      : "Отклонить"}
                  </button>

                  <button
                    className={`status-button cancel-button ${
                      application.status === ApplicationStatus.CANCELLED
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      updateApplicationStatus(ApplicationStatus.CANCELLED)
                    }
                    disabled={
                      updating ||
                      application.status === ApplicationStatus.CANCELLED
                    }
                  >
                    {updating &&
                    application.status !== ApplicationStatus.CANCELLED
                      ? "Обработка..."
                      : "Отменить"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-message">Заявка не найдена</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ApplicationDetail
