import React, { useState } from "react"
import { Season, TourType } from "../../models/enums"
import "./TourFilters.css"

const TourFilters = ({ onFilterChange, availableCountries = [] }) => {
  const [filters, setFilters] = useState({
    search: "",
    season: "",
    type: "",
    duration: "",
    country: "",
  })

  // Диапазоны длительности туров
  const durationRanges = [
    { value: "1-3", label: "1-3 дня" },
    { value: "4-7", label: "4-7 дней" },
    { value: "8-14", label: "8-14 дней" },
    { value: "15+", label: "15+ дней" },
  ]

  // Обработка изменения значений фильтров
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  // Сброс всех фильтров
  const resetFilters = () => {
    const emptyFilters = {
      search: "",
      season: "",
      type: "",
      duration: "",
      country: "",
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="tour-filters">
      <div className="filter-header">
        <h3>Фильтры</h3>
        <button className="reset-button" onClick={resetFilters}>
          Сбросить
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="search">Поиск по названию</label>
          <input
            type="text"
            id="search"
            placeholder="Введите название тура"
            value={filters.search}
            onChange={e => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="country">Страна</label>
          <select
            id="country"
            value={filters.country}
            onChange={e => handleFilterChange("country", e.target.value)}
            disabled={availableCountries.length === 0}
          >
            <option value="">
              {availableCountries.length === 0
                ? "Загрузка стран..."
                : "Все страны"}
            </option>
            {availableCountries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="season">Сезон</label>
          <select
            id="season"
            value={filters.season}
            onChange={e => handleFilterChange("season", e.target.value)}
          >
            <option value="">Все сезоны</option>
            <option value={Season.WINTER}>Зима</option>
            <option value={Season.SPRING}>Весна</option>
            <option value={Season.SUMMER}>Лето</option>
            <option value={Season.AUTUMN}>Осень</option>
            <option value={Season.ALL_YEAR}>Круглый год</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type">Тип тура</label>
          <select
            id="type"
            value={filters.type}
            onChange={e => handleFilterChange("type", e.target.value)}
          >
            <option value="">Все типы</option>
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

        <div className="filter-group">
          <label htmlFor="duration">Длительность</label>
          <select
            id="duration"
            value={filters.duration}
            onChange={e => handleFilterChange("duration", e.target.value)}
          >
            <option value="">Любая</option>
            {durationRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default TourFilters
