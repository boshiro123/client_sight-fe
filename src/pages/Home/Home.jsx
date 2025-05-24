import React, { useState, useEffect } from "react"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import TourCard from "../../common-ui/TourCard"
import TourFilters from "../../common-ui/TourFilters"
import * as TourService from "../../services/TourService"
import "./Home.css"

const Home = () => {
  const [tours, setTours] = useState([])
  const [filteredTours, setFilteredTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("date")
  const [availableCountries, setAvailableCountries] = useState([])

  // Загрузка реальных данных с сервера
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true)
      setError(null)

      try {
        const toursData = await TourService.getAllTours()
        console.log(toursData)
        setTours(toursData)
        setFilteredTours(toursData)

        // Извлекаем уникальные страны из туров
        const countries = [...new Set(toursData.map(tour => tour.country))]
          .filter(Boolean)
          .sort()
        setAvailableCountries(countries)
      } catch (err) {
        console.error("Ошибка при загрузке туров:", err)
        setError("Не удалось загрузить туры. Пожалуйста, попробуйте позже.")
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  // Обработка изменения фильтров
  const handleFilterChange = filters => {
    let result = [...tours]

    // Фильтрация по поисковому запросу
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        tour =>
          tour.name.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower)
      )
    }

    // Фильтрация по стране
    if (filters.country) {
      result = result.filter(tour => tour.country === filters.country)
    }

    // Фильтрация по сезону
    if (filters.season) {
      result = result.filter(tour => tour.season === filters.season)
    }

    // Фильтрация по типу
    if (filters.type) {
      result = result.filter(tour => tour.type === filters.type)
    }

    // Фильтрация по длительности (вычисляем из дат начала и окончания)
    if (filters.duration) {
      const [min, max] = filters.duration.split("-")

      result = result.filter(tour => {
        // Вычисляем длительность в днях из дат
        const startDate = new Date(tour.startDate)
        const endDate = new Date(tour.endDate)
        const duration = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        )

        if (max && max !== "+") {
          return duration >= parseInt(min) && duration <= parseInt(max)
        } else {
          // Для случая '15+'
          return duration >= parseInt(min)
        }
      })
    }

    setFilteredTours(result)
  }

  // Обработка изменения сортировки
  const handleSortChange = e => {
    const sortValue = e.target.value
    setSortBy(sortValue)

    let sortedTours = [...filteredTours]

    switch (sortValue) {
      case "date":
        sortedTours.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        )
        break
      case "duration":
        sortedTours.sort((a, b) => {
          const durationA = Math.ceil(
            (new Date(a.endDate) - new Date(a.startDate)) /
              (1000 * 60 * 60 * 24)
          )
          const durationB = Math.ceil(
            (new Date(b.endDate) - new Date(b.startDate)) /
              (1000 * 60 * 60 * 24)
          )
          return durationA - durationB
        })
        break
      case "price-low":
        sortedTours.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sortedTours.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredTours(sortedTours)
  }

  return (
    <div className="home-page">
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Открывайте мир вместе с нами</h1>
            <p>Найдите идеальный тур для вашего следующего путешествия</p>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <h2>О компании</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  Компания ClientSight - современная туристическая компания,
                  специализирующаяся на организации незабываемых путешествий по
                  всему миру. Мы предлагаем широкий выбор туров различной
                  направленности и ценовой категории.
                </p>
                <p>
                  Наша миссия - делать путешествия доступными и комфортными для
                  каждого человека, создавая индивидуальный подход к организации
                  отдыха.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">5000+</span>
                  <span className="stat-label">Довольных клиентов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Направлений</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Лет опыта</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tours-section" id="tours-section">
          <div className="container">
            <h2>Доступные туры</h2>

            <div className="tours-controls">
              <TourFilters
                onFilterChange={handleFilterChange}
                availableCountries={availableCountries}
              />

              <div className="tours-sort">
                <label htmlFor="sort">Сортировать по:</label>
                <select id="sort" value={sortBy} onChange={handleSortChange}>
                  <option value="date">Дате отправления</option>
                  <option value="duration">Длительности</option>
                  <option value="price-low">Цене (по возрастанию)</option>
                  <option value="price-high">Цене (по убыванию)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Загрузка туров...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredTours.length === 0 ? (
              <div className="no-results">
                Туры не найдены. Попробуйте изменить параметры поиска.
              </div>
            ) : (
              <div className="tours-grid">
                {filteredTours.map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
