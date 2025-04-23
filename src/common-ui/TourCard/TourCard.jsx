import React from "react"
import { Link } from "react-router-dom"
import "./TourCard.css"

const TourCard = ({ tour }) => {
  const {
    id,
    name,
    description,
    imagePath,
    imageData,
    imageType,
    startDate,
    endDate,
    availableSlots,
    totalSlots,
    price,
    isRegistrationClosed,
    country,
    season,
    type,
  } = tour

  // Получение источника изображения (URL или base64)
  const getImageSource = () => {
    if (imagePath) {
      return imagePath
    } else if (imageData) {
      // Если есть base64 данные, формируем data URL
      return `data:${imageType || "image/jpeg"};base64,${imageData}`
    }
    return "/placeholder-tour.jpg"
  }

  // Форматирование дат
  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // Вычисление длительности тура
  const calculateDuration = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  }

  const duration = calculateDuration(startDate, endDate)

  // Проверка статуса тура
  const isSoldOut = availableSlots === 0
  const today = new Date()
  const tourStartDate = new Date(startDate)
  const isRegistrationEnded =
    isRegistrationClosed ||
    (new Date(tourStartDate).setHours(0, 0, 0, 0) -
      new Date(today).setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24) <=
      1

  // Форматирование цены
  const formatPrice = price => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="tour-card">
      {isSoldOut && <div className="tour-status sold-out">Распродано</div>}
      {isRegistrationEnded && !isSoldOut && (
        <div className="tour-status closed">Регистрация закрыта</div>
      )}

      <div className="tour-image">
        <img src={getImageSource()} alt={name} />
      </div>

      <div className="tour-details">
        <h3 className="tour-name">{name}</h3>

        <div className="tour-tags">
          <span className="tour-country">{country}</span>
          <span className="tour-season">{getSeasonText(season)}</span>
          <span className="tour-type">{getTourTypeText(type)}</span>
        </div>

        <p className="tour-description">
          {description && description.length > 100
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
          {price && (
            <div className="tour-price">
              <strong>Цена:</strong> {formatPrice(price)}
            </div>
          )}
        </div>

        <div className="tour-footer">
          <div className="tour-slots">
            <strong>Свободных мест:</strong> {availableSlots}/{totalSlots}
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

// Получение текстового представления сезона
function getSeasonText(season) {
  if (!season) return "Не указан"

  switch (season) {
    case "WINTER":
      return "Зима"
    case "SPRING":
      return "Весна"
    case "SUMMER":
      return "Лето"
    case "AUTUMN":
      return "Осень"
    case "ALL_YEAR":
      return "Круглый год"
    default:
      return season
  }
}

// Получение текстового представления типа тура
function getTourTypeText(type) {
  if (!type) return "Не указан"

  switch (type) {
    case "BEACH":
      return "Пляжный"
    case "EXCURSION":
      return "Экскурсионный"
    case "ADVENTURE":
      return "Приключенческий"
    case "SKIING":
      return "Горнолыжный"
    case "CRUISE":
      return "Круиз"
    case "CULTURAL":
      return "Культурный"
    case "MEDICAL":
      return "Оздоровительный"
    case "EDUCATIONAL":
      return "Образовательный"
    default:
      return type
  }
}

export default TourCard
