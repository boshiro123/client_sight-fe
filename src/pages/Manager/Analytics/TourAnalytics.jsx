import React from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import { TourSeason, TourType } from "../../../models/enums"

// Регистрируем необходимые компоненты для графиков
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const TourAnalytics = ({ data }) => {
  // Константы для доступа к данным
  const {
    tourSeasonDistribution,
    tourTypeDistribution,
    seasonPredictions,
    typePredictions,
  } = data

  // Формируем данные для диаграммы "Распределение туров по сезонам"
  const seasonLabels = ["Зима", "Весна", "Лето", "Осень", "Круглый год"]

  const seasonData = {
    labels: seasonLabels,
    datasets: [
      {
        data: [
          tourSeasonDistribution.WINTER,
          tourSeasonDistribution.SPRING,
          tourSeasonDistribution.SUMMER,
          tourSeasonDistribution.AUTUMN,
          tourSeasonDistribution.ALL_YEAR,
        ],
        backgroundColor: [
          "#4e73df", // Зима
          "#1cc88a", // Весна
          "#f6c23e", // Лето
          "#e74a3b", // Осень
          "#36b9cc", // Круглый год
        ],
        borderWidth: 1,
      },
    ],
  }

  // Формируем данные для диаграммы "Распределение туров по типам"
  const typeLabels = [
    "Пляжный",
    "Экскурсионный",
    "Приключение",
    "Горнолыжный",
    "Круиз",
    "Культурный",
    "Оздоровительный",
    "Образовательный",
  ]

  const typeData = {
    labels: typeLabels,
    datasets: [
      {
        label: "Количество туров",
        data: [
          tourTypeDistribution.BEACH,
          tourTypeDistribution.EXCURSION,
          tourTypeDistribution.ADVENTURE,
          tourTypeDistribution.SKIING,
          tourTypeDistribution.CRUISE,
          tourTypeDistribution.CULTURAL,
          tourTypeDistribution.MEDICAL,
          tourTypeDistribution.EDUCATIONAL,
        ],
        backgroundColor: "#1cc88a",
      },
    ],
  }

  // Опции для диаграмм
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  // Функция для отображения тренда
  const renderTrendIndicator = (trend, percentage) => {
    if (trend === "insufficient_data") {
      return (
        <span className="trend-insufficient">
          Недостаточно данных для прогноза
        </span>
      )
    }

    let icon = null
    let className = ""

    if (trend === "increasing") {
      icon = "↑"
      className = "trend-up"
    } else if (trend === "decreasing") {
      icon = "↓"
      className = "trend-down"
    } else {
      icon = "→"
      className = "trend-stable"
    }

    return (
      <div className={`trend-indicator ${className}`}>
        <span>{icon}</span>
        <span className="trend-percentage">{percentage}%</span>
      </div>
    )
  }

  // Функция для получения текстового описания тренда
  const getTrendDescription = (trend, percentage) => {
    if (trend === "insufficient_data") {
      return "Недостаточно данных для прогноза"
    }

    if (trend === "increasing") {
      return `Популярность растет (${percentage}%)`
    } else if (trend === "decreasing") {
      return `Популярность снижается (${percentage}%)`
    } else {
      return "Стабильная популярность"
    }
  }

  // Функция для отображения названия сезона
  const getSeasonName = season => {
    switch (season) {
      case TourSeason.WINTER:
        return "Зима"
      case TourSeason.SPRING:
        return "Весна"
      case TourSeason.SUMMER:
        return "Лето"
      case TourSeason.AUTUMN:
        return "Осень"
      case TourSeason.ALL_YEAR:
        return "Круглый год"
      default:
        return season
    }
  }

  // Функция для отображения названия типа тура
  const getTourTypeName = type => {
    switch (type) {
      case TourType.BEACH:
        return "Пляжный"
      case TourType.EXCURSION:
        return "Экскурсионный"
      case TourType.ADVENTURE:
        return "Приключение"
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
        return type
    }
  }

  return (
    <div className="tour-analytics">
      <div className="analytics-row">
        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Распределение туров по сезонам
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Pie data={seasonData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Распределение туров по типам
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Bar data={typeData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">
            Прогноз популярности по сезонам
          </h3>
        </div>
        <div className="analytics-card-body">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Сезон</th>
                <th>Количество туров</th>
                <th>Средняя популярность</th>
                <th>Тренд</th>
                <th>Прогноз</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(seasonPredictions).map(([season, data]) => (
                <tr key={season}>
                  <td>{getSeasonName(season)}</td>
                  <td>{tourSeasonDistribution[season]}</td>
                  <td>{data.currentAverage} заявок/тур</td>
                  <td>{renderTrendIndicator(data.trend, data.percentage)}</td>
                  <td>{getTrendDescription(data.trend, data.percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">
            Прогноз популярности по типам туров
          </h3>
        </div>
        <div className="analytics-card-body">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Тип тура</th>
                <th>Количество туров</th>
                <th>Средняя популярность</th>
                <th>Тренд</th>
                <th>Прогноз</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(typePredictions).map(([type, data]) => (
                <tr key={type}>
                  <td>{getTourTypeName(type)}</td>
                  <td>{tourTypeDistribution[type]}</td>
                  <td>{data.currentAverage} заявок/тур</td>
                  <td>{renderTrendIndicator(data.trend, data.percentage)}</td>
                  <td>{getTrendDescription(data.trend, data.percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TourAnalytics
