import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import * as TourService from "../../services/TourService"
import * as AuthService from "../../services/AuthService"
import "./TourPage.css"

const TourPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true)
        const tourData = await TourService.getTourById(id)
        setTour(tourData)
        setLoading(false)
      } catch (err) {
        console.error("Ошибка при загрузке тура:", err)
        setError("Не удалось загрузить информацию о туре")
        setLoading(false)
      }
    }

    const checkAuth = async () => {
      setIsAuthenticated(AuthService.isAuthenticated())
    }

    fetchTour()
    checkAuth()
  }, [id])

  // Форматирование дат
  const formatDate = dateString => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // Вычисление длительности тура
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  }

  // Получение текстового представления сезона
  const getSeasonText = season => {
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
  const getTourTypeText = type => {
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

  // Функция для получения правильного склонения слова "дней"
  const getDurationText = duration => {
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

  // Получение источника изображения (URL или base64)
  const getImageSource = () => {
    if (!tour) return "/placeholder-tour.jpg"

    if (tour.imagePath) {
      return tour.imagePath
    } else if (tour.imageData) {
      // Если есть base64 данные, формируем data URL
      return `data:${tour.imageType || "image/jpeg"};base64,${tour.imageData}`
    }
    return "/placeholder-tour.jpg"
  }

  // Проверка статуса тура
  const isSoldOut = tour?.availableSlots === 0
  const isRegistrationEnded = () => {
    if (!tour) return false
    const today = new Date()
    const tourStartDate = new Date(tour.startDate)
    return (
      tour.isRegistrationClosed ||
      (new Date(tourStartDate).setHours(0, 0, 0, 0) -
        new Date(today).setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24) <=
        1
    )
  }

  // Форматирование цены
  const formatPrice = price => {
    if (!price) return ""
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "BYN",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Обработчик для кнопки "Оставить заявку"
  const handleApply = () => {
    navigate(`/application?tourId=${id}`)
  }

  if (loading) {
    return (
      <div className="tour-page">
        <Header />
        <main className="tour-main">
          <div className="container">
            <div className="loading-container">
              <div className="loading">Загрузка информации о туре...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="tour-page">
        <Header />
        <main className="tour-main">
          <div className="container">
            <div className="error-container">
              <div className="error">{error || "Тур не найден"}</div>
              <Link to="/" className="back-link">
                Вернуться на главную
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const duration = calculateDuration(tour.startDate, tour.endDate)

  return (
    <div className="tour-page">
      <Header />

      <main className="tour-main">
        <div className="container">
          <div className="tour-header">
            <h1 className="tour-title">{tour.name}</h1>
            <div className="tour-meta">
              <span className="tour-country">{tour.country}</span>
              <span className="tour-season">{getSeasonText(tour.season)}</span>
              <span className="tour-type">{getTourTypeText(tour.type)}</span>
            </div>
          </div>

          <div className="tour-content">
            <div className="tour-image-container">
              <img
                src={getImageSource()}
                alt={tour.name}
                className="tour-image"
              />

              {isSoldOut && (
                <div className="tour-status sold-out">Распродано</div>
              )}
              {isRegistrationEnded() && !isSoldOut && (
                <div className="tour-status closed">Регистрация закрыта</div>
              )}
            </div>

            <div className="tour-info-container">
              <div className="tour-info-block">
                <h3>Информация о туре</h3>
                <div className="tour-info-grid">
                  <div className="info-group">
                    <span className="info-label">Дата начала:</span>
                    <span className="info-value">
                      {formatDate(tour.startDate)}
                    </span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Дата окончания:</span>
                    <span className="info-value">
                      {formatDate(tour.endDate)}
                    </span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Длительность:</span>
                    <span className="info-value">
                      {duration} {getDurationText(duration)}
                    </span>
                  </div>
                  <div className="info-group">
                    <span className="info-label">Свободных мест:</span>
                    <span className="info-value">
                      {tour.availableSlots}/{tour.totalSlots}
                    </span>
                  </div>
                  {tour.price && (
                    <div className="info-group">
                      <span className="info-label">Цена:</span>
                      <span className="info-value price">
                        {formatPrice(tour.price)}
                      </span>
                    </div>
                  )}
                </div>

                {!isSoldOut && !isRegistrationEnded() && (
                  <button className="apply-button" onClick={handleApply}>
                    Оставить заявку
                  </button>
                )}
                {!isAuthenticated && !isSoldOut && !isRegistrationEnded() && (
                  <div className="auth-hint">
                    <Link to="/login" className="auth-link">
                      Войти
                    </Link>{" "}
                    или{" "}
                    <Link to="/register" className="auth-link">
                      зарегистрироваться
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="tour-description-container">
              <h3>Описание тура</h3>
              <div className="tour-description">{tour.description}</div>
            </div>

            {tour.fileName && tour.fileData && (
              <div className="tour-files-container">
                <h3>Дополнительные материалы</h3>
                <div className="tour-files">
                  <a
                    href={`data:${tour.fileType || "application/pdf"};base64,${
                      tour.fileData
                    }`}
                    download={tour.fileName}
                    className="tour-file-link"
                  >
                    <i className="file-icon">📄</i>
                    <span>{tour.fileName}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="tour-footer">
            <Link to="/" className="back-button">
              Вернуться к списку туров
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TourPage
