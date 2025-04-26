import React, { useState } from "react"
import { AgeGroup, Gender, TourType } from "../../../models/enums"
import ApplicationsModal from "./ApplicationsModal"
import DiscountForm from "./DiscountForm"
import "./ClientsList.css"

const ClientsList = ({ tourists, loading, error, refreshData }) => {
  const [showApplications, setShowApplications] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

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

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const handleViewApplications = client => {
    setSelectedClient(client)
    setShowApplications(true)
  }

  const handleEditDiscount = client => {
    setSelectedClient(client)
    setShowDiscountForm(true)
  }

  const handleCloseModals = () => {
    setShowApplications(false)
    setShowDiscountForm(false)
    setSelectedClient(null)
  }

  if (loading) {
    return <div className="loading-spinner">Загрузка клиентов...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (tourists.length === 0) {
    return <div className="no-data-message">Клиенты не найдены</div>
  }

  return (
    <div className="clients-list">
      <h2 className="section-title">
        Клиенты с аккаунтами ({tourists.length})
      </h2>

      <div className="client-cards">
        {tourists.map(tourist => (
          <div key={tourist.id} className="client-card">
            <div className="client-header">
              <h3 className="client-name">{tourist.fullName}</h3>
              {tourist.contact.discountPercent > 0 && (
                <span className="client-discount">
                  Скидка: {tourist.contact.discountPercent}%
                </span>
              )}
            </div>

            <div className="client-info">
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{tourist.email}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Телефон:</span>
                <span className="info-value">
                  {tourist.contact.phoneNumber || "Не указан"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Пол:</span>
                <span className="info-value">
                  {getGenderText(tourist.contact.gender)}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Возраст:</span>
                <span className="info-value">
                  {getAgeGroupText(tourist.contact.ageGroup)}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Предпочитаемые туры:</span>
                <span className="info-value">
                  {tourist.contact.preferredTourType
                    ? getTourTypeText(tourist.contact.preferredTourType)
                    : "Не указаны"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Зарегистрирован:</span>
                <span className="info-value">
                  {formatDate(tourist.createdAt)}
                </span>
              </div>

              {tourist.contact.additionalInfo && (
                <div className="info-row additional-info">
                  <span className="info-label">Дополнительная информация:</span>
                  <span className="info-value">
                    {tourist.contact.additionalInfo}
                  </span>
                </div>
              )}
            </div>

            <div className="client-actions">
              <button
                className="action-button view-applications"
                onClick={() => handleViewApplications(tourist)}
              >
                Просмотреть заявки
              </button>
              <button
                className="action-button edit-discount"
                onClick={() => handleEditDiscount(tourist.contact)}
              >
                Изменить скидку
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра заявок */}
      <ApplicationsModal
        isOpen={showApplications}
        onClose={handleCloseModals}
        client={selectedClient}
      />

      {/* Модальное окно для изменения скидки */}
      <DiscountForm
        isOpen={showDiscountForm}
        onClose={handleCloseModals}
        contact={selectedClient}
        refreshData={refreshData}
      />
    </div>
  )
}

export default ClientsList
