import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { TourSeason, TourType, AgeGroup, Gender } from "../../../models/enums"

// Регистрируем необходимые компоненты для графиков
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const MixedAnalytics = ({ seasonGenderData, typeAgeData }) => {
  // Преобразование данных для графика "Сезон + Пол"
  const seasonGenderChartData = {
    labels: ["Зима", "Весна", "Лето", "Осень", "Круглый год"],
    datasets: [
      {
        label: "Мужской",
        data: [
          seasonGenderData.WINTER.MALE,
          seasonGenderData.SPRING.MALE,
          seasonGenderData.SUMMER.MALE,
          seasonGenderData.AUTUMN.MALE,
          seasonGenderData.ALL_YEAR.MALE,
        ],
        backgroundColor: "#4e73df",
      },
      {
        label: "Женский",
        data: [
          seasonGenderData.WINTER.FEMALE,
          seasonGenderData.SPRING.FEMALE,
          seasonGenderData.SUMMER.FEMALE,
          seasonGenderData.AUTUMN.FEMALE,
          seasonGenderData.ALL_YEAR.FEMALE,
        ],
        backgroundColor: "#e74a3b",
      },
      {
        label: "Другой",
        data: [
          seasonGenderData.WINTER.OTHER,
          seasonGenderData.SPRING.OTHER,
          seasonGenderData.SUMMER.OTHER,
          seasonGenderData.AUTUMN.OTHER,
          seasonGenderData.ALL_YEAR.OTHER,
        ],
        backgroundColor: "#1cc88a",
      },
    ],
  }

  // Опции для графика "Сезон + Пол"
  const seasonGenderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Распределение заявок по сезонам и полу",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  }

  // Генерируем данные для разных типов туров и возрастных групп
  const generateTypeAgeDatasets = () => {
    const datasets = []
    const ageGroups = [
      { key: AgeGroup.UNDER_18, label: "До 18 лет", color: "#4e73df" },
      { key: AgeGroup.AGE_18_20, label: "18-20 лет", color: "#1cc88a" },
      { key: AgeGroup.AGE_21_25, label: "21-25 лет", color: "#36b9cc" },
      { key: AgeGroup.AGE_26_35, label: "26-35 лет", color: "#f6c23e" },
      { key: AgeGroup.AGE_36_50, label: "36-50 лет", color: "#e74a3b" },
      { key: AgeGroup.OVER_50, label: "Старше 50 лет", color: "#858796" },
    ]

    ageGroups.forEach(ageGroup => {
      datasets.push({
        label: ageGroup.label,
        data: [
          typeAgeData.BEACH[ageGroup.key],
          typeAgeData.EXCURSION[ageGroup.key],
          typeAgeData.ADVENTURE[ageGroup.key],
          typeAgeData.SKIING[ageGroup.key],
          typeAgeData.CRUISE[ageGroup.key],
          typeAgeData.CULTURAL[ageGroup.key],
          typeAgeData.MEDICAL[ageGroup.key],
          typeAgeData.EDUCATIONAL[ageGroup.key],
        ],
        backgroundColor: ageGroup.color,
      })
    })

    return datasets
  }

  // Данные для графика "Тип тура + Возраст"
  const typeAgeChartData = {
    labels: [
      "Пляжный",
      "Экскурсионный",
      "Приключение",
      "Горнолыжный",
      "Круиз",
      "Культурный",
      "Оздоровительный",
      "Образовательный",
    ],
    datasets: generateTypeAgeDatasets(),
  }

  // Опции для графика "Тип тура + Возраст"
  const typeAgeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Распределение заявок по типам туров и возрасту",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  }

  // Функция для формирования таблицы "Сезон + Пол"
  const renderSeasonGenderTable = () => (
    <table className="analytics-table">
      <thead>
        <tr>
          <th>Сезон</th>
          <th>Мужской</th>
          <th>Женский</th>
          <th>Другой</th>
          <th>Всего</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(seasonGenderData).map(([season, genderData]) => {
          const seasonTotal =
            genderData.MALE + genderData.FEMALE + genderData.OTHER

          return (
            <tr key={season}>
              <td>
                {season === TourSeason.WINTER && "Зима"}
                {season === TourSeason.SPRING && "Весна"}
                {season === TourSeason.SUMMER && "Лето"}
                {season === TourSeason.AUTUMN && "Осень"}
                {season === TourSeason.ALL_YEAR && "Круглый год"}
              </td>
              <td>
                {genderData.MALE} (
                {seasonTotal > 0
                  ? ((genderData.MALE / seasonTotal) * 100).toFixed(1)
                  : 0}
                %)
              </td>
              <td>
                {genderData.FEMALE} (
                {seasonTotal > 0
                  ? ((genderData.FEMALE / seasonTotal) * 100).toFixed(1)
                  : 0}
                %)
              </td>
              <td>
                {genderData.OTHER} (
                {seasonTotal > 0
                  ? ((genderData.OTHER / seasonTotal) * 100).toFixed(1)
                  : 0}
                %)
              </td>
              <td>
                <strong>{seasonTotal}</strong>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  return (
    <div className="mixed-analytics">
      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">
            Распределение заявок по сезонам и полу
          </h3>
        </div>
        <div className="analytics-card-body">
          <div className="chart-container">
            <Bar data={seasonGenderChartData} options={seasonGenderOptions} />
          </div>
          <div className="analytics-summary">{renderSeasonGenderTable()}</div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-card-title">
            Распределение заявок по типам туров и возрасту
          </h3>
        </div>
        <div className="analytics-card-body">
          <div className="chart-container">
            <Bar data={typeAgeChartData} options={typeAgeOptions} />
          </div>
          <div className="analytics-insights">
            <h4>Ключевые выводы:</h4>
            <ul>
              <li>
                Анализ помогает выявить предпочтения разных возрастных групп по
                типам туров
              </li>
              <li>Можно определить сезонные предпочтения мужчин и женщин</li>
              <li>
                Эти данные позволяют точнее таргетировать рекламные кампании
              </li>
              <li>
                На основе этой информации можно разрабатывать специальные
                предложения для конкретных сегментов клиентов
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MixedAnalytics
