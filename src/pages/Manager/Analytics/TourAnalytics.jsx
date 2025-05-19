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
  LineElement,
  PointElement,
} from "chart.js"
import { Pie, Bar, Line } from "react-chartjs-2"
import { TourSeason, TourType } from "../../../models/enums"

// Регистрируем необходимые компоненты для графиков
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  PointElement
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

  // Данные для прогноза по сезонам
  const seasonPredictionData = {
    labels: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июнь",
      "Июль",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
      "Янв*",
      "Фев*",
      "Мар*",
    ],
    datasets: [
      {
        label: "Зима",
        data: [15, 20, 10, 5, 0, 0, 0, 0, 0, 0, 10, 25, 28, 30, 12],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        fill: false,
        tension: 0.4,
        borderDash: [0, 0],
      },
      {
        label: "Весна",
        data: [0, 0, 15, 20, 25, 10, 0, 0, 0, 0, 0, 0, 0, 0, 16],
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28, 200, 138, 0.1)",
        fill: false,
        tension: 0.4,
        borderDash: [0, 0],
      },
      {
        label: "Лето",
        data: [0, 0, 0, 5, 15, 30, 35, 25, 10, 0, 0, 0, 0, 0, 0],
        borderColor: "#f6c23e",
        backgroundColor: "rgba(246, 194, 62, 0.1)",
        fill: false,
        tension: 0.4,
        borderDash: [0, 0],
      },
      {
        label: "Осень",
        data: [0, 0, 0, 0, 0, 0, 0, 5, 20, 25, 15, 0, 0, 0, 0],
        borderColor: "#e74a3b",
        backgroundColor: "rgba(231, 74, 59, 0.1)",
        fill: false,
        tension: 0.4,
        borderDash: [0, 0],
      },
    ],
  }

  // Добавляем стиль пунктирной линии для прогнозных значений
  seasonPredictionData.datasets.forEach(dataset => {
    dataset.borderDash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5] // пунктир для прогнозируемых месяцев

    // Также делаем точки разного размера
    dataset.pointRadius = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6]
    dataset.pointStyle = [
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "circle",
      "star",
      "star",
      "star",
    ]
  })

  // Данные для прогноза по типам туров
  const tourTypePredictionData = {
    labels: ["Q1", "Q2", "Q3", "Q4", "Q1*", "Q2*"],
    datasets: [
      {
        label: "Пляжный",
        data: [15, 25, 35, 15, 20, 30],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Экскурсионный",
        data: [20, 15, 20, 25, 20, 15],
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28, 200, 138, 0.1)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Приключение",
        data: [10, 15, 20, 10, 15, 25],
        borderColor: "#f6c23e",
        backgroundColor: "rgba(246, 194, 62, 0.1)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Горнолыжный",
        data: [15, 5, 0, 12, 14, 4],
        borderColor: "#e74a3b",
        backgroundColor: "rgba(231, 74, 59, 0.1)",
        fill: false,
        tension: 0.4,
      },
    ],
  }

  // Добавляем стиль пунктирной линии для прогнозных значений
  tourTypePredictionData.datasets.forEach(dataset => {
    dataset.borderDash = [0, 0, 0, 0, 5, 5] // пунктир для прогнозируемых кварталов

    // Также делаем точки разного размера и стиля
    dataset.pointRadius = [4, 4, 4, 4, 6, 6]
    dataset.pointStyle = [
      "circle",
      "circle",
      "circle",
      "circle",
      "star",
      "star",
    ]
  })

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

  // Опции для линейных графиков прогнозов
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const label = context[0].label
            if (label.endsWith("*")) {
              return label + " (прогноз)"
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Количество туров",
        },
      },
      x: {
        title: {
          display: true,
          text: "* - прогнозные данные",
        },
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

      <div className="analytics-row">
        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Прогноз популярности по сезонам
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Line data={seasonPredictionData} options={lineOptions} />
              </div>
              <div className="analytics-insights">
                <p>
                  Прогноз показывает ожидаемые изменения в популярности сезонов
                  на следующий квартал.
                </p>
                <p>Звездочками (*) отмечены прогнозные значения.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Прогноз популярности типов туров
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Line data={tourTypePredictionData} options={lineOptions} />
              </div>
              <div className="analytics-insights">
                <p>
                  Прогноз показывает ожидаемые изменения в популярности типов
                  туров на следующие 2 квартала.
                </p>
                <p>Звездочками (*) отмечены прогнозные значения.</p>
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
                <th>Текущее количество туров</th>
                <th>Тенденция</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(seasonPredictions).map(([season, prediction]) => (
                <tr key={season}>
                  <td>{getSeasonName(season)}</td>
                  <td>
                    {season === TourSeason.WINTER &&
                      tourSeasonDistribution.WINTER}
                    {season === TourSeason.SPRING &&
                      tourSeasonDistribution.SPRING}
                    {season === TourSeason.SUMMER &&
                      tourSeasonDistribution.SUMMER}
                    {season === TourSeason.AUTUMN &&
                      tourSeasonDistribution.AUTUMN}
                    {season === TourSeason.ALL_YEAR &&
                      tourSeasonDistribution.ALL_YEAR}
                  </td>
                  <td>
                    {renderTrendIndicator(
                      prediction.trend,
                      prediction.percentage
                    )}
                  </td>
                  <td>
                    {getTrendDescription(
                      prediction.trend,
                      prediction.percentage
                    )}
                  </td>
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
                <th>Текущее количество туров</th>
                <th>Тенденция</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(typePredictions).map(([type, prediction]) => (
                <tr key={type}>
                  <td>{getTourTypeName(type)}</td>
                  <td>
                    {type === TourType.BEACH && tourTypeDistribution.BEACH}
                    {type === TourType.EXCURSION &&
                      tourTypeDistribution.EXCURSION}
                    {type === TourType.ADVENTURE &&
                      tourTypeDistribution.ADVENTURE}
                    {type === TourType.SKIING && tourTypeDistribution.SKIING}
                    {type === TourType.CRUISE && tourTypeDistribution.CRUISE}
                    {type === TourType.CULTURAL &&
                      tourTypeDistribution.CULTURAL}
                    {type === TourType.MEDICAL && tourTypeDistribution.MEDICAL}
                    {type === TourType.EDUCATIONAL &&
                      tourTypeDistribution.EDUCATIONAL}
                  </td>
                  <td>
                    {renderTrendIndicator(
                      prediction.trend,
                      prediction.percentage
                    )}
                  </td>
                  <td>
                    {getTrendDescription(
                      prediction.trend,
                      prediction.percentage
                    )}
                  </td>
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
