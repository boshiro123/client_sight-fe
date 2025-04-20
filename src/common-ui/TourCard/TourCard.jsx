import React from "react"
import { Link } from "react-router-dom"
import "./TourCard.css"

const TourCard = ({ tour }) => {
  const {
    id,
    name,
    description,
    imagePath,
    startDate,
    endDate,
    duration,
    availableSlots,
    isRegistrationClosed,
    country,
    season,
    type,
  } = tour

  // Форматирование дат
  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // Проверка статуса тура
  const isSoldOut = availableSlots === 0
  const today = new Date()
  const tourStartDate = new Date(startDate)
  const isRegistrationEnded =
    isRegistrationClosed ||
    (tourStartDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24) <=
      1

  return (
    <div className="tour-card">
      {isSoldOut && <div className="tour-status sold-out">Распродано</div>}
      {isRegistrationEnded && !isSoldOut && (
        <div className="tour-status closed">Регистрация закрыта</div>
      )}

      <div className="tour-image">
        <img src={imagePath || "/placeholder-tour.jpg"} alt={name} />
      </div>

      <div className="tour-details">
        <h3 className="tour-name">{name}</h3>

        <div className="tour-tags">
          <span className="tour-country">{country}</span>
          <span className="tour-season">{season}</span>
          <span className="tour-type">{type}</span>
        </div>

        <p className="tour-description">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>

        <div className="tour-info">
          <div className="tour-dates">
            <div>
              <strong>Отъезд:</strong> {formatDate(startDate)}
            </div>
            <div>
              <strong>Возвращение:</strong> {formatDate(endDate)}
            </div>
          </div>
          <div className="tour-duration">
            <strong>Длительность:</strong> {duration}{" "}
            {getDurationText(duration)}
          </div>
        </div>

        <div className="tour-footer">
          <div className="tour-slots">
            <strong>Свободных мест:</strong> {availableSlots}
          </div>

          <div className="tour-actions">
            <Link to={`/tours/${id}`} className="btn btn-details">
              Подробнее
            </Link>

            {!isRegistrationEnded && availableSlots > 0 && (
              <Link
                to={`/application?tourId=${id}`}
                className="btn btn-primary"
              >
                Оставить заявку
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Функция для получения правильного склонения слова "дней"
function getDurationText(duration) {
  const lastDigit = duration % 10
  const lastTwoDigits = duration % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "дней"
  }

  if (lastDigit === 1) {
    return "день"
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дня"
  }

  return "дней"
}

export default TourCard
