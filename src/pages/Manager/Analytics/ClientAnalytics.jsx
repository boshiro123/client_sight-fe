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
  // Константы для доступа к данным
  const {
    clientsVsContacts,
    genderDistribution,
    ageDistribution,
    preferredTourTypeDistribution,
    regularClients,
  } = data

  // Формируем данные для круговой диаграммы "Клиенты vs Контакты"
  const clientsVsContactsData = {
    labels: ["Клиенты", "Контакты"],
    datasets: [
      {
        data: [clientsVsContacts.clients, clientsVsContacts.contacts],
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
          genderDistribution.MALE,
          genderDistribution.FEMALE,
          genderDistribution.OTHER,
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
          ageDistribution.UNDER_18,
          ageDistribution.AGE_18_20,
          ageDistribution.AGE_21_25,
          ageDistribution.AGE_26_35,
          ageDistribution.AGE_36_50,
          ageDistribution.OVER_50,
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
          preferredTourTypeDistribution.BEACH,
          preferredTourTypeDistribution.EXCURSION,
          preferredTourTypeDistribution.ADVENTURE,
          preferredTourTypeDistribution.SKIING,
          preferredTourTypeDistribution.CRUISE,
          preferredTourTypeDistribution.CULTURAL,
          preferredTourTypeDistribution.MEDICAL,
          preferredTourTypeDistribution.EDUCATIONAL,
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
