import React, { useState, useEffect } from "react"
import * as ContactService from "../../../../services/ContactService"
import "./DiscountForm.css"

const DiscountForm = ({ isOpen, onClose, onSuccess, contact, refreshData }) => {
  const [discountPercent, setDiscountPercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (contact && isOpen) {
      setDiscountPercent(contact.discountPercent || 0)
      setError(null)
      setSuccess(false)
    }
  }, [contact, isOpen])

  const handleInputChange = e => {
    const value = parseInt(e.target.value, 10) || 0
    // Ограничиваем процент скидки диапазоном от 0 до 100
    setDiscountPercent(Math.min(Math.max(value, 0), 100))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Обновляем скидку
      await ContactService.updateContactDiscount(contact.id, discountPercent)

      setSuccess(true)

      // Обновляем данные
      if (refreshData) {
        refreshData()
      }

      // Закрываем форму через 1.5 секунды после успешного сохранения
      setTimeout(() => {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      console.error("Ошибка при обновлении скидки:", err)
      setError("Не удалось обновить скидку. Пожалуйста, попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="discount-form-overlay">
      <div className="discount-form-container">
        <div className="discount-form-header">
          <h2>Изменение скидки</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="form-error-message">{error}</div>}
        {success && (
          <div className="form-success-message">Скидка успешно обновлена!</div>
        )}

        <form className="discount-form" onSubmit={handleSubmit}>
          <div className="discount-info">
            <p>
              Клиент: <strong>{contact?.fullName}</strong>
            </p>
            {contact?.email && (
              <p>
                Email: <strong>{contact.email}</strong>
              </p>
            )}
            <p>
              Текущая скидка: <strong>{contact?.discountPercent || 0}%</strong>
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="discountPercent">Новая скидка (%)</label>
            <div className="discount-input-group">
              <input
                type="number"
                id="discountPercent"
                name="discountPercent"
                min="0"
                max="100"
                value={discountPercent}
                onChange={handleInputChange}
                required
              />
              <span className="percent-sign">%</span>
            </div>
            <div className="discount-slider">
              <input
                type="range"
                min="0"
                max="100"
                value={discountPercent}
                onChange={handleInputChange}
                className="slider"
              />
              <div className="slider-labels">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
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
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DiscountForm
