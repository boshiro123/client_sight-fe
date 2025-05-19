import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import * as ApplicationService from "../../../../services/ApplicationService"
import { ApplicationStatus } from "../../../../models/enums"
import "./ApplicationsModal.css"

const ApplicationsModal = ({ isOpen, onClose, client }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && client && client.email) {
      fetchApplications(client.email)
    }
  }, [isOpen, client])

  const fetchApplications = async email => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApplicationService.getApplicationsByEmail(email)
      setApplications(data)
    } catch (err) {
      console.error("Ошибка при загрузке заявок:", err)
      setError("Не удалось загрузить заявки. Пожалуйста, попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

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

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const handleViewDetails = applicationId => {
    navigate(`/employee/applications/${applicationId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="applications-modal-overlay">
      <div className="applications-modal-container">
        <div className="applications-modal-header">
          <h2>Заявки клиента</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="applications-modal-content">
          {loading ? (
            <div className="loading-spinner">Загрузка заявок...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : applications.length === 0 ? (
            <div className="no-data-message">У клиента нет заявок</div>
          ) : (
            <div className="applications-list">
              <div className="client-info">
                <p>
                  Клиент: <strong>{client?.fullName}</strong>
                </p>
                <p>
                  Email: <strong>{client?.email}</strong>
                </p>
              </div>

              <h3>Всего заявок: {applications.length}</h3>

              <div className="application-items">
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
                          <span className="info-label">Дата заявки:</span>
                          <span className="info-value">
                            {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="application-actions">
                        <button
                          className="btn-view-details"
                          onClick={() => handleViewDetails(application.id)}
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationsModal
