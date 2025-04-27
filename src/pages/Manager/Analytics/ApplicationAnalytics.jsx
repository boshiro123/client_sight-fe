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
import { ApplicationStatus, TourSeason, TourType } from "../../../models/enums"

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

const ApplicationAnalytics = ({ data }) => {
  // Константы для доступа к данным
  const {
    applicationStatusDistribution,
    applicationSeasonDistribution,
    applicationTypeDistribution,
  } = data

  // Формируем данные для диаграммы "Распределение заявок по статусам"
  const statusLabels = ["Ожидает", "Одобрена", "Отклонена", "Отменена"]

  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        data: [
          applicationStatusDistribution.PENDING,
          applicationStatusDistribution.APPROVED,
          applicationStatusDistribution.REJECTED,
          applicationStatusDistribution.CANCELLED,
        ],
        backgroundColor: [
          "#f6c23e", // Ожидает
          "#1cc88a", // Одобрена
          "#e74a3b", // Отклонена
          "#858796", // Отменена
        ],
        borderWidth: 1,
      },
    ],
  }

  // Формируем данные для диаграммы "Распределение заявок по сезонам"
  const seasonLabels = ["Зима", "Весна", "Лето", "Осень", "Круглый год"]

  const seasonData = {
    labels: seasonLabels,
    datasets: [
      {
        label: "Количество заявок",
        data: [
          applicationSeasonDistribution.WINTER,
          applicationSeasonDistribution.SPRING,
          applicationSeasonDistribution.SUMMER,
          applicationSeasonDistribution.AUTUMN,
          applicationSeasonDistribution.ALL_YEAR,
        ],
        backgroundColor: "#4e73df",
      },
    ],
  }

  // Формируем данные для диаграммы "Распределение заявок по типам туров"
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
        label: "Количество заявок",
        data: [
          applicationTypeDistribution.BEACH,
          applicationTypeDistribution.EXCURSION,
          applicationTypeDistribution.ADVENTURE,
          applicationTypeDistribution.SKIING,
          applicationTypeDistribution.CRUISE,
          applicationTypeDistribution.CULTURAL,
          applicationTypeDistribution.MEDICAL,
          applicationTypeDistribution.EDUCATIONAL,
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

  // Рассчитываем общее количество заявок
  const totalApplications =
    applicationStatusDistribution.PENDING +
    applicationStatusDistribution.APPROVED +
    applicationStatusDistribution.REJECTED +
    applicationStatusDistribution.CANCELLED

  // Рассчитываем конверсию (процент одобренных заявок)
  const conversionRate =
    totalApplications > 0
      ? (
          (applicationStatusDistribution.APPROVED / totalApplications) *
          100
        ).toFixed(2)
      : 0

  return (
    <div className="application-analytics">
      <div className="analytics-row">
        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Распределение заявок по статусам
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Pie data={statusData} options={pieOptions} />
              </div>
              <div className="analytics-summary">
                <p>
                  <strong>Всего заявок:</strong> {totalApplications}
                </p>
                <p>
                  <strong>Конверсия (одобренные заявки):</strong>{" "}
                  {conversionRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Распределение заявок по типам туров
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
            Распределение заявок по сезонам
          </h3>
        </div>
        <div className="analytics-card-body">
          <div className="chart-container">
            <Bar data={seasonData} options={barOptions} />
          </div>
          <div className="analytics-summary">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Сезон</th>
                  <th>Количество заявок</th>
                  <th>Процент от общего числа</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(applicationSeasonDistribution).map(
                  ([season, count]) => (
                    <tr key={season}>
                      <td>
                        {season === TourSeason.WINTER && "Зима"}
                        {season === TourSeason.SPRING && "Весна"}
                        {season === TourSeason.SUMMER && "Лето"}
                        {season === TourSeason.AUTUMN && "Осень"}
                        {season === TourSeason.ALL_YEAR && "Круглый год"}
                      </td>
                      <td>{count}</td>
                      <td>
                        {totalApplications > 0
                          ? ((count / totalApplications) * 100).toFixed(2)
                          : 0}
                        %
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationAnalytics
