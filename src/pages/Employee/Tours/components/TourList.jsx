import React from "react"
import { FaEdit, FaTrash } from "react-icons/fa"
import "./TourList.css"
import { Season, TourType } from "../../../../models/enums"

// Вспомогательная функция для форматирования даты
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Функция для получения текстового представления сезона
const getSeasonText = season => {
  switch (season) {
    case Season.WINTER:
      return "Зима"
    case Season.SPRING:
      return "Весна"
    case Season.SUMMER:
      return "Лето"
    case Season.AUTUMN:
      return "Осень"
    case Season.ALL_YEAR:
      return "Круглый год"
    default:
      return "Неизвестно"
  }
}

// Функция для получения текстового представления типа тура
const getTourTypeText = type => {
  switch (type) {
    case TourType.BEACH:
      return "Пляжный"
    case TourType.EXCURSION:
      return "Экскурсионный"
    case TourType.ADVENTURE:
      return "Приключенческий"
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
      return "Неизвестно"
  }
}

const TourList = ({ tours, onEdit, onDelete }) => {
  if (!tours || tours.length === 0) {
    return (
      <div className="tour-list-empty">
        Нет доступных туров. Создайте новый тур, нажав кнопку "Добавить тур".
      </div>
    )
  }

  return (
    <div className="tour-list">
      <div className="tour-list-header">
        <div>Название</div>
        <div>Страна</div>
        <div className="tour-header-season">Сезон</div>
        <div className="tour-header-type">Тип</div>
        <div>Места</div>
        <div className="tour-header-dates">Даты</div>
        <div>Действия</div>
      </div>
      <div className="tour-list-body">
        {tours.map(tour => {
          const dateRange = `${formatDate(tour.startDate)} - ${formatDate(
            tour.endDate
          )}`

          return (
            <div key={tour.id} className="tour-list-item">
              <div className="tour-item-name" title={tour.name}>
                {tour.name}
              </div>
              <div className="tour-item-country" title={tour.country}>
                {tour.country}
              </div>
              <div className="tour-item-season">
                {getSeasonText(tour.season)}
              </div>
              <div className="tour-item-type">{getTourTypeText(tour.type)}</div>
              <div className="tour-item-slots">
                {tour.availableSlots} / {tour.totalSlots} мест
              </div>
              <div className="tour-item-dates" title={dateRange}>
                {dateRange}
              </div>
              <div className="tour-item-actions">
                <button
                  className="tour-edit-button"
                  onClick={() => onEdit(tour)}
                  title="Редактировать"
                >
                  <FaEdit />
                </button>
                <button
                  className="tour-delete-button"
                  onClick={() => onDelete(tour.id)}
                  title="Удалить"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TourList
