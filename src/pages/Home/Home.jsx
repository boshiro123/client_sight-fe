import React, { useState, useEffect } from "react"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import TourCard from "../../common-ui/TourCard"
import TourFilters from "../../common-ui/TourFilters"
import "./Home.css"

// Тестовые данные для примера, в реальном приложении будут получены с сервера
import { mockTours } from "./mockData"

const Home = () => {
  const [tours, setTours] = useState([])
  const [filteredTours, setFilteredTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("date")

  // Имитация загрузки данных с сервера
  useEffect(() => {
    const fetchTours = () => {
      // Тут будет API запрос в реальном приложении
      setTimeout(() => {
        setTours(mockTours)
        setFilteredTours(mockTours)
        setLoading(false)
      }, 800)
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

    // Фильтрация по длительности
    if (filters.duration) {
      const [min, max] = filters.duration.split("-")
      if (max && max !== "+") {
        result = result.filter(
          tour =>
            tour.duration >= parseInt(min) && tour.duration <= parseInt(max)
        )
      } else if (min) {
        // Для случая '15+'
        result = result.filter(tour => tour.duration >= parseInt(min))
      }
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
        sortedTours.sort((a, b) => a.duration - b.duration)
        break
      case "price-low":
        // Если бы была цена
        break
      case "price-high":
        // Если бы была цена
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

        <section className="tours-section">
          <div className="container">
            <h2>Доступные туры</h2>

            <div className="tours-controls">
              <TourFilters onFilterChange={handleFilterChange} />

              <div className="tours-sort">
                <label htmlFor="sort">Сортировать по:</label>
                <select id="sort" value={sortBy} onChange={handleSortChange}>
                  <option value="date">Дате отправления</option>
                  <option value="duration">Длительности</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Загрузка туров...</div>
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
