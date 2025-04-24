import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import * as ApplicationService from "../../../services/ApplicationService"
import { ApplicationStatus, Gender, AgeGroup } from "../../../models/enums"
import "./ApplicationsList.css"

const ApplicationsList = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await ApplicationService.getAllApplications()
        setApplications(data)
        setError(null)
        console.log(data)
      } catch (err) {
        console.error("Ошибка при загрузке заявок:", err)
        setError("Не удалось загрузить заявки. Пожалуйста, попробуйте позже.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

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

  const handleViewDetails = applicationId => {
    navigate(`/employee/applications/${applicationId}`)
  }

  const filteredApplications =
    statusFilter === "ALL"
      ? applications
      : applications.filter(app => app.status === statusFilter)

  return (
    <div className="applications-list-container">
      <div className="applications-header">
        <h1>Заявки на туры</h1>
        <div className="filter-controls">
          <label htmlFor="statusFilter">Фильтр по статусу:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Все заявки</option>
            <option value={ApplicationStatus.PENDING}>В ожидании</option>
            <option value={ApplicationStatus.APPROVED}>Одобрены</option>
            <option value={ApplicationStatus.REJECTED}>Отклонены</option>
            <option value={ApplicationStatus.CANCELLED}>Отменены</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Загрузка заявок...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-applications-message">
          <p>Заявок не найдено</p>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-card-header">
                <span
                  className={`application-status ${getStatusClass(
                    application.status
                  )}`}
                >
                  {getStatusText(application.status)}
                </span>
                <span className="application-id">ID: {application.id}</span>
              </div>

              <div className="application-tour-info">
                <h3>{application.tour?.name || "Неизвестный тур"}</h3>
                <p className="tour-country">
                  {application.tour?.country || "Страна не указана"}
                </p>
                <p className="tour-dates">
                  {application.tour?.startDate && application.tour?.endDate
                    ? `${new Date(
                        application.tour.startDate
                      ).toLocaleDateString("ru-RU")} - 
                       ${new Date(application.tour.endDate).toLocaleDateString(
                         "ru-RU"
                       )}`
                    : "Даты не указаны"}
                </p>
              </div>

              <div className="application-client-info">
                <div className="client-info-row">
                  <span className="info-label">ФИО:</span>
                  <span className="info-value">{application.fullName}</span>
                </div>
                <div className="client-info-row">
                  <span className="info-label">Телефон:</span>
                  <span className="info-value">{application.phoneNumber}</span>
                </div>
                <div className="client-info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{application.email}</span>
                </div>
                <div className="client-info-row">
                  <span className="info-label">Пол:</span>
                  <span className="info-value">
                    {getGenderText(application.contact.gender)}
                  </span>
                </div>
                <div className="client-info-row">
                  <span className="info-label">Возраст:</span>
                  <span className="info-value">
                    {getAgeGroupText(application.contact.ageGroup)}
                  </span>
                </div>
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

              <div className="application-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewDetails(application.id)}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApplicationsList
