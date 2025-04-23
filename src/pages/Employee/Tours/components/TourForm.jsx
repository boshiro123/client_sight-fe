import React, { useState, useEffect } from "react"
import { Season, TourType } from "../../../../models/enums"
import "./TourForm.css"

const TourForm = ({ tour, onSubmit, onCancel, isSubmitting }) => {
  const initialFormData = {
    name: "",
    description: "",
    country: "",
    city: "",
    season: Season.SUMMER,
    type: TourType.EXCURSION,
    price: 0,
    totalSlots: 10,
    availableSlots: 10,
    startDate: "",
    endDate: "",
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [tourImage, setTourImage] = useState(null)
  const [tourFile, setTourFile] = useState(null)

  useEffect(() => {
    // Если передан тур для редактирования, заполняем форму его данными
    if (tour) {
      setFormData({
        name: tour.name || "",
        description: tour.description || "",
        country: tour.country || "",
        city: tour.city || "",
        season: tour.season || Season.SUMMER,
        type: tour.type || TourType.EXCURSION,
        price: tour.price || 0,
        totalSlots: tour.totalSlots || 10,
        availableSlots: tour.availableSlots || 10,
        startDate: tour.startDate
          ? new Date(tour.startDate).toISOString().split("T")[0]
          : "",
        endDate: tour.endDate
          ? new Date(tour.endDate).toISOString().split("T")[0]
          : "",
      })
    } else {
      // Сбрасываем форму при создании нового тура
      setFormData(initialFormData)
      setTourImage(null)
      setTourFile(null)
    }
  }, [tour])

  const handleChange = e => {
    const { name, value, type } = e.target
    const fieldValue = type === "number" ? parseFloat(value) : value

    setFormData({
      ...formData,
      [name]: fieldValue,
    })

    // Очищаем ошибки при изменении поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log("Выбрано изображение:", file.name, file.type)
      setTourImage(file)
    }
  }

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log("Выбран файл:", file.name, file.type)
      setTourFile(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Валидация обязательных полей
    if (!formData.name.trim()) {
      newErrors.name = "Введите название тура"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Введите описание тура"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Введите страну"
    }

    if (!formData.city.trim()) {
      newErrors.city = "Введите город"
    }

    if (formData.price <= 0) {
      newErrors.price = "Цена должна быть больше нуля"
    }

    if (formData.totalSlots <= 0) {
      newErrors.totalSlots = "Количество мест должно быть больше нуля"
    }

    if (
      formData.availableSlots < 0 ||
      formData.availableSlots > formData.totalSlots
    ) {
      newErrors.availableSlots =
        "Доступных мест не может быть больше чем всего мест"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Выберите дату начала тура"
    }

    if (!formData.endDate) {
      newErrors.endDate = "Выберите дату окончания тура"
    } else if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "Дата окончания не может быть раньше даты начала"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (validateForm()) {
      // Преобразуем даты в формат LocalDateTime, добавляя время
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? `${formData.startDate}T00:00:00` : null,
        endDate: formData.endDate ? `${formData.endDate}T23:59:59` : null,
      }

      onSubmit(formattedData, tourImage, tourFile)
    }
  }

  return (
    <div className="tour-form-container">
      <h2>{tour ? "Редактирование тура" : "Создание нового тура"}</h2>

      <form className="tour-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Название тура *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание тура *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={errors.description ? "error" : ""}
          ></textarea>
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Страна *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? "error" : ""}
            />
            {errors.country && (
              <div className="error-message">{errors.country}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city">Город *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="season">Сезон</label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
            >
              <option value={Season.WINTER}>Зима</option>
              <option value={Season.SPRING}>Весна</option>
              <option value={Season.SUMMER}>Лето</option>
              <option value={Season.AUTUMN}>Осень</option>
              <option value={Season.ALL_YEAR}>Круглый год</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Тип тура</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value={TourType.BEACH}>Пляжный</option>
              <option value={TourType.EXCURSION}>Экскурсионный</option>
              <option value={TourType.ADVENTURE}>Приключенческий</option>
              <option value={TourType.SKIING}>Горнолыжный</option>
              <option value={TourType.CRUISE}>Круиз</option>
              <option value={TourType.CULTURAL}>Культурный</option>
              <option value={TourType.MEDICAL}>Оздоровительный</option>
              <option value={TourType.EDUCATIONAL}>Образовательный</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Цена (руб.) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="100"
              className={errors.price ? "error" : ""}
            />
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="totalSlots">Всего мест *</label>
            <input
              type="number"
              id="totalSlots"
              name="totalSlots"
              value={formData.totalSlots}
              onChange={handleChange}
              min="1"
              className={errors.totalSlots ? "error" : ""}
            />
            {errors.totalSlots && (
              <div className="error-message">{errors.totalSlots}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="availableSlots">Доступно мест *</label>
            <input
              type="number"
              id="availableSlots"
              name="availableSlots"
              value={formData.availableSlots}
              onChange={handleChange}
              min="0"
              max={formData.totalSlots}
              className={errors.availableSlots ? "error" : ""}
            />
            {errors.availableSlots && (
              <div className="error-message">{errors.availableSlots}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Дата начала *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "error" : ""}
            />
            {errors.startDate && (
              <div className="error-message">{errors.startDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Дата окончания *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "error" : ""}
            />
            {errors.endDate && (
              <div className="error-message">{errors.endDate}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tourImage">Изображение тура</label>
            <input
              type="file"
              id="tourImage"
              name="tourImage"
              onChange={handleImageChange}
              accept="image/*"
            />
            <small>Рекомендуемый размер: 1200x800 пикселей</small>
          </div>

          <div className="form-group">
            <label htmlFor="tourFile">Описание тура (PDF)</label>
            <input
              type="file"
              id="tourFile"
              name="tourFile"
              onChange={handleFileChange}
              accept=".pdf"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Сохранение..."
              : tour
              ? "Сохранить изменения"
              : "Создать тур"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TourForm
