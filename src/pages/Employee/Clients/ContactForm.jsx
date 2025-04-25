import React, { useState, useEffect } from "react"
import { AgeGroup, Gender, TourType } from "../../../models/enums"
import * as ContactService from "../../../services/ContactService"
import "./ContactForm.css"

const ContactForm = ({
  isOpen,
  onClose,
  onSuccess,
  contactToEdit = null,
  refreshContacts,
}) => {
  const initialFormData = {
    fullName: "",
    phoneNumber: "",
    email: "",
    ageGroup: "",
    gender: "",
    preferredTourType: "",
    discountPercent: 0,
    additionalInfo: "",
    isClient: false,
  }

  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const isEditMode = !!contactToEdit

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        id: contactToEdit.id,
        fullName: contactToEdit.fullName || "",
        phoneNumber: contactToEdit.phoneNumber || "",
        email: contactToEdit.email || "",
        ageGroup: contactToEdit.ageGroup || "",
        gender: contactToEdit.gender || "",
        preferredTourType: contactToEdit.preferredTourType || "",
        discountPercent: contactToEdit.discountPercent || 0,
        additionalInfo: contactToEdit.additionalInfo || "",
        isClient: contactToEdit.isClient || false,
      })
    } else {
      setFormData(initialFormData)
    }
    setError(null)
    setSuccess(false)
  }, [contactToEdit, isOpen])

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "discountPercent"
          ? parseInt(value, 10) || 0
          : value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditMode) {
        // Обновление существующего контакта
        await ContactService.updateContact(contactToEdit.id, formData)
      } else {
        // Создание нового контакта
        await ContactService.createContact(formData)
      }

      setSuccess(true)
      setFormData(initialFormData)

      // Обновляем список контактов
      if (refreshContacts) {
        refreshContacts()
      }

      // Закрываем форму через 1.5 секунды после успешного сохранения
      setTimeout(() => {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      console.error("Ошибка при сохранении контакта:", err)
      setError(
        "Не удалось сохранить контакт. Пожалуйста, проверьте данные и попробуйте снова."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="contact-form-overlay">
      <div className="contact-form-container">
        <div className="contact-form-header">
          <h2>
            {isEditMode
              ? "Редактирование контакта"
              : "Создание нового контакта"}
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="form-error-message">{error}</div>}
        {success && (
          <div className="form-success-message">
            {isEditMode
              ? "Контакт успешно обновлен!"
              : "Контакт успешно создан!"}
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">ФИО*</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Фамилия Имя Отчество"
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="phoneNumber">Телефон*</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="form-row two-columns">
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
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="preferredTourType">Предпочитаемый тип тура</label>
              <select
                id="preferredTourType"
                name="preferredTourType"
                value={formData.preferredTourType}
                onChange={handleInputChange}
              >
                <option value="">Выберите тип тура</option>
                <option value={TourType.BEACH}>Пляжный отдых</option>
                <option value={TourType.EXCURSION}>Экскурсионный</option>
                <option value={TourType.ADVENTURE}>Приключение</option>
                <option value={TourType.SKIING}>Горнолыжный</option>
                <option value={TourType.CRUISE}>Круиз</option>
                <option value={TourType.CULTURAL}>Культурный</option>
                <option value={TourType.MEDICAL}>Оздоровительный</option>
                <option value={TourType.EDUCATIONAL}>Образовательный</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="discountPercent">Скидка (%)</label>
              <input
                type="number"
                id="discountPercent"
                name="discountPercent"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="additionalInfo">Дополнительная информация</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows="3"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Дополнительная информация о контакте"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Сохранение..." : isEditMode ? "Обновить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
