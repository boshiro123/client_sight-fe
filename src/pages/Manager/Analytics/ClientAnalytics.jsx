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

const ClientAnalytics = ({ data }) => {
  // Проверяем наличие данных
  if (!data || typeof data !== "object") {
    return (
      <div className="analytics-error">
        Данные аналитики клиентов недоступны
      </div>
    )
  }

  // Константы для доступа к данным с значениями по умолчанию
  const {
    clientsVsContacts = { clients: 0, contacts: 0 },
    genderDistribution = { MALE: 0, FEMALE: 0, OTHER: 0 },
    ageDistribution = {
      UNDER_18: 0,
      AGE_18_20: 0,
      AGE_21_25: 0,
      AGE_26_35: 0,
      AGE_36_50: 0,
      OVER_50: 0,
    },
    preferredTourTypeDistribution = {
      BEACH: 0,
      EXCURSION: 0,
      ADVENTURE: 0,
      SKIING: 0,
      CRUISE: 0,
      CULTURAL: 0,
      MEDICAL: 0,
      EDUCATIONAL: 0,
    },
    regularClients = { count: 0, percentage: 0 },
  } = data

  // Формируем данные для круговой диаграммы "Клиенты vs Контакты"
  const clientsVsContactsData = {
    labels: ["Клиенты", "Контакты"],
    datasets: [
      {
        data: [clientsVsContacts.clients || 0, clientsVsContacts.contacts || 0],
        backgroundColor: ["#4e73df", "#36b9cc"],
        borderWidth: 1,
      },
    ],
  }

  // Формируем данные для диаграммы "Распределение по полу"
  const genderData = {
    labels: ["Мужской", "Женский", "Другой"],
    datasets: [
      {
        data: [
          genderDistribution.MALE || 0,
          genderDistribution.FEMALE || 0,
          genderDistribution.OTHER || 0,
        ],
        backgroundColor: ["#4e73df", "#e74a3b", "#1cc88a"],
        borderWidth: 1,
      },
    ],
  }

  // Формируем данные для диаграммы "Распределение по возрасту"
  const ageLabels = [
    "До 18 лет",
    "18-20 лет",
    "21-25 лет",
    "26-35 лет",
    "36-50 лет",
    "Старше 50 лет",
  ]

  const ageData = {
    labels: ageLabels,
    datasets: [
      {
        label: "Количество клиентов",
        data: [
          ageDistribution.UNDER_18 || 0,
          ageDistribution.AGE_18_20 || 0,
          ageDistribution.AGE_21_25 || 0,
          ageDistribution.AGE_26_35 || 0,
          ageDistribution.AGE_36_50 || 0,
          ageDistribution.OVER_50 || 0,
        ],
        backgroundColor: "#4e73df",
      },
    ],
  }

  // Формируем данные для диаграммы "Предпочитаемые типы туров"
  const tourTypeLabels = [
    "Пляжный",
    "Экскурсионный",
    "Приключение",
    "Горнолыжный",
    "Круиз",
    "Культурный",
    "Оздоровительный",
    "Образовательный",
  ]

  const tourTypeData = {
    labels: tourTypeLabels,
    datasets: [
      {
        label: "Предпочтения клиентов",
        data: [
          preferredTourTypeDistribution.BEACH || 0,
          preferredTourTypeDistribution.EXCURSION || 0,
          preferredTourTypeDistribution.ADVENTURE || 0,
          preferredTourTypeDistribution.SKIING || 0,
          preferredTourTypeDistribution.CRUISE || 0,
          preferredTourTypeDistribution.CULTURAL || 0,
          preferredTourTypeDistribution.MEDICAL || 0,
          preferredTourTypeDistribution.EDUCATIONAL || 0,
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
        position: "top",
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

  return (
    <div className="client-analytics">
      <div className="analytics-row">
        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Клиенты и контакты</h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Pie data={clientsVsContactsData} options={pieOptions} />
              </div>
              <div className="analytics-summary">
                <p>
                  <strong>Всего клиентов:</strong> {clientsVsContacts.clients}
                </p>
                <p>
                  <strong>Всего контактов:</strong> {clientsVsContacts.contacts}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">Распределение по полу</h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Pie data={genderData} options={pieOptions} />
              </div>
              <div className="analytics-summary">
                <p>
                  <strong>Мужской:</strong> {genderDistribution.MALE}
                </p>
                <p>
                  <strong>Женский:</strong> {genderDistribution.FEMALE}
                </p>
                <p>
                  <strong>Другой:</strong> {genderDistribution.OTHER}
                </p>
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
                Распределение по возрасту
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Bar data={ageData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-col">
          <div className="analytics-card">
            <div className="analytics-card-header">
              <h3 className="analytics-card-title">
                Предпочитаемые типы туров
              </h3>
            </div>
            <div className="analytics-card-body">
              <div className="chart-container">
                <Bar data={tourTypeData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">
            Постоянные клиенты (3+ заявки)
          </h3>
        </div>
        <div className="analytics-card-body">
          <div className="analytics-summary">
            <p>
              <strong>Количество постоянных клиентов:</strong>{" "}
              {regularClients.count}
            </p>
            <p>
              <strong>Процент от общего числа клиентов:</strong>{" "}
              {regularClients.percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientAnalytics
