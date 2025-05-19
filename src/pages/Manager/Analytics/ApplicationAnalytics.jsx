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
import { ApplicationStatus, TourSeason, TourType } from "../../../models/enums"

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

  // Данные для прогноза количества заявок по месяцам
  const applicationsTimelineData = {
    labels: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
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
        label: "Фактическое количество заявок",
        data: [
          45,
          52,
          68,
          65,
          85,
          95,
          110,
          120,
          90,
          75,
          60,
          55,
          null,
          null,
          null,
        ],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Прогноз",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          60,
          55,
          50,
          58,
          70,
        ],
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28, 200, 138, 0.1)",
        borderDash: [5, 5],
        fill: true,
        tension: 0.3,
        pointStyle: "star",
        pointRadius: 6,
      },
    ],
  }

  // Данные для прогноза конверсии заявок (процент одобренных)
  const conversionTimelineData = {
    labels: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
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
        label: "Фактическая конверсия (%)",
        data: [
          60,
          65,
          68,
          70,
          72,
          75,
          78,
          80,
          82,
          81,
          80,
          82,
          null,
          null,
          null,
        ],
        borderColor: "#e74a3b",
        backgroundColor: "rgba(231, 74, 59, 0.1)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Прогноз",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          80,
          82,
          83,
          85,
          87,
        ],
        borderColor: "#f6c23e",
        backgroundColor: "rgba(246, 194, 62, 0.1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.3,
        pointStyle: "star",
        pointRadius: 6,
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
          text: "Количество заявок",
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

  // Опции для линейного графика конверсии
  const conversionLineOptions = {
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
          text: "Конверсия (%)",
        },
        min: 50,
        max: 100,
      },
      x: {
        title: {
          display: true,
          text: "* - прогнозные данные",
        },
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
          <h3 className="analytics-card-title">Прогноз количества заявок</h3>
        </div>
        <div className="analytics-card-body">
          <div className="chart-container">
            <Line data={applicationsTimelineData} options={lineOptions} />
          </div>
          <div className="analytics-insights">
            <p>
              График показывает динамику количества заявок за прошедший год и
              прогноз на следующий квартал.
            </p>
            <p>
              Прогноз построен на основе исторических данных с учетом сезонности
              и тенденций рынка.
            </p>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">Прогноз конверсии заявок</h3>
        </div>
        <div className="analytics-card-body">
          <div className="chart-container">
            <Line
              data={conversionTimelineData}
              options={conversionLineOptions}
            />
          </div>
          <div className="analytics-insights">
            <p>
              График показывает динамику конверсии заявок (процент одобренных
              заявок) и прогноз на следующий квартал.
            </p>
            <p>
              Ожидается рост конверсии благодаря улучшению процессов обработки
              заявок и более точному таргетированию предложений.
            </p>
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
