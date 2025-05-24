import React, { useState } from "react"
import { AgeGroup, Gender, TourType } from "../../../../models/enums"
import * as ContactService from "../../../../services/ContactService"
import ContactForm from "./ContactForm"
import "./ContactsList.css"

const ContactsList = ({ contacts, loading, error, refreshContacts }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [processing, setProcessing] = useState(null) // id контакта, который обрабатывается
  const [operationError, setOperationError] = useState(null)
  const [operationSuccess, setOperationSuccess] = useState(null)

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

  const handleCreateContact = () => {
    setEditingContact(null)
    setShowForm(true)
  }

  const handleEditContact = contact => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingContact(null)
  }

  const handleFormSuccess = () => {
    // Действия после успешного создания/редактирования
    // Обновление списка контактов происходит в самой форме
  }

  const handleConvertToClient = async contact => {
    setProcessing(contact.id)
    setOperationError(null)
    setOperationSuccess(null)

    try {
      if (contact.isClient) {
        // Если уже клиент, меняем статус через обычное обновление
        await ContactService.updateContact(contact.id, {
          ...contact,
          isClient: false,
        })
        setOperationSuccess(`Контакт ${contact.fullName} отмечен как не клиент`)
      } else {
        // Если не клиент, создаем пользователя из контакта
        await ContactService.createUserFromContact(contact)
        setOperationSuccess(
          `Контакт ${contact.fullName} успешно преобразован в клиента`
        )
      }

      // Обновляем список контактов
      if (refreshContacts) {
        refreshContacts()
      }

      // Сбрасываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setOperationSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Ошибка при изменении статуса контакта:", err)
      setOperationError(
        contact.isClient
          ? "Не удалось изменить статус контакта. Пожалуйста, попробуйте позже."
          : "Не удалось создать пользователя из контакта. Пожалуйста, проверьте данные (особенно email) и попробуйте снова."
      )

      // Сбрасываем сообщение об ошибке через 5 секунд
      setTimeout(() => {
        setOperationError(null)
      }, 5000)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Загрузка контактов...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="contacts-list">
      <div className="contacts-header">
        <h2 className="section-title">Контакты ({contacts.length})</h2>
        <button className="add-contact-button" onClick={handleCreateContact}>
          Добавить контакт
        </button>
      </div>

      {operationSuccess && (
        <div className="operation-success-message">{operationSuccess}</div>
      )}

      {operationError && (
        <div className="operation-error-message">{operationError}</div>
      )}

      {contacts.length === 0 ? (
        <div className="no-data-message">Контакты не найдены</div>
      ) : (
        <div className="contact-cards">
          {contacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <div className="contact-header">
                <h3 className="contact-name">{contact.fullName}</h3>
                <div className="contact-status">
                  <span
                    className={`status-badge ${
                      contact.isClient ? "is-client" : "not-client"
                    }`}
                  >
                    {contact.isClient ? "Клиент" : "Потенциальный клиент"}
                  </span>
                </div>
              </div>

              <div className="contact-info">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    {contact.email || "Не указан"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Телефон:</span>
                  <span className="info-value">
                    {contact.phoneNumber || "Не указан"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Пол:</span>
                  <span className="info-value">
                    {getGenderText(contact.gender)}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Возраст:</span>
                  <span className="info-value">
                    {getAgeGroupText(contact.ageGroup)}
                  </span>
                </div>

                {contact.preferredTourType && (
                  <div className="info-row">
                    <span className="info-label">Предпочитаемые туры:</span>
                    <span className="info-value">
                      {getTourTypeText(contact.preferredTourType)}
                    </span>
                  </div>
                )}

                {contact.discountPercent > 0 && (
                  <div className="info-row">
                    <span className="info-label">Скидка:</span>
                    <span className="info-value">
                      {contact.discountPercent}%
                    </span>
                  </div>
                )}

                {contact.additionalInfo && (
                  <div className="info-row additional-info">
                    <span className="info-label">
                      Дополнительная информация:
                    </span>
                    <span className="info-value">{contact.additionalInfo}</span>
                  </div>
                )}
              </div>

              <div className="contact-actions">
                <button
                  className="action-button edit-contact"
                  onClick={() => handleEditContact(contact)}
                >
                  Редактировать
                </button>
                <button
                  className={`action-button convert-to-client ${
                    processing === contact.id ? "processing" : ""
                  }`}
                  onClick={() => handleConvertToClient(contact)}
                  disabled={processing !== null}
                >
                  {processing === contact.id
                    ? "Обработка..."
                    : contact.isClient
                    ? "Отметить как не клиента"
                    : "Создать клиента"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Форма для создания/редактирования контакта */}
      <ContactForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        contactToEdit={editingContact}
        refreshContacts={refreshContacts}
      />
    </div>
  )
}

export default ContactsList
