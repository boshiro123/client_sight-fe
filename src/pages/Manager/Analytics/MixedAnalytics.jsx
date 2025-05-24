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

const MixedAnalytics = ({ data }) => {
  // Извлекаем данные из переданного объекта
  const seasonGenderData = data.seasonGenderDistribution
  const typeAgeData = data.typeAgeDistribution

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

  // Функция для генерации умных выводов на основе данных
  const generateInsights = () => {
    const insights = []

    // Анализ сезонных предпочтений по полу
    let maxSeasonGender = null
    let maxSeasonGenderCount = 0
    let totalByGender = { MALE: 0, FEMALE: 0, OTHER: 0 }

    Object.entries(seasonGenderData).forEach(([season, genderData]) => {
      const seasonTotal =
        (genderData?.MALE || 0) +
        (genderData?.FEMALE || 0) +
        (genderData?.OTHER || 0)

      totalByGender.MALE += genderData?.MALE || 0
      totalByGender.FEMALE += genderData?.FEMALE || 0
      totalByGender.OTHER += genderData?.OTHER || 0

      Object.entries(genderData || {}).forEach(([gender, count]) => {
        if (count > maxSeasonGenderCount) {
          maxSeasonGenderCount = count
          maxSeasonGender = { season, gender, count }
        }
      })
    })

    // Определяем самый популярный пол
    const mostPopularGender = Object.entries(totalByGender).reduce((a, b) =>
      totalByGender[a[0]] > totalByGender[b[0]] ? a : b
    )[0]

    const genderNames = {
      MALE: "мужчины",
      FEMALE: "женщины",
      OTHER: "другие",
    }

    const seasonNames = {
      WINTER: "зимой",
      SPRING: "весной",
      SUMMER: "летом",
      AUTUMN: "осенью",
      ALL_YEAR: "круглый год",
    }

    if (maxSeasonGender) {
      insights.push(
        `Наиболее активная группа: ${genderNames[maxSeasonGender.gender]} ${
          seasonNames[maxSeasonGender.season]
        } (${maxSeasonGender.count} заявок)`
      )
    }

    if (mostPopularGender) {
      const percentage =
        totalByGender[mostPopularGender] > 0
          ? (
              (totalByGender[mostPopularGender] /
                Object.values(totalByGender).reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1)
          : 0
      insights.push(
        `${genderNames[mostPopularGender]} составляют ${percentage}% от всех заявок`
      )
    }

    // Анализ возрастных предпочтений по типам туров
    let maxTypeAge = null
    let maxTypeAgeCount = 0

    Object.entries(typeAgeData).forEach(([tourType, ageData]) => {
      Object.entries(ageData || {}).forEach(([ageGroup, count]) => {
        if (count > maxTypeAgeCount) {
          maxTypeAgeCount = count
          maxTypeAge = { tourType, ageGroup, count }
        }
      })
    })

    const tourTypeNames = {
      BEACH: "пляжные туры",
      EXCURSION: "экскурсионные туры",
      ADVENTURE: "приключенческие туры",
      SKIING: "горнолыжные туры",
      CRUISE: "круизы",
      CULTURAL: "культурные туры",
      MEDICAL: "оздоровительные туры",
      EDUCATIONAL: "образовательные туры",
    }

    const ageGroupNames = {
      UNDER_18: "молодежь до 18 лет",
      AGE_18_20: "возрастная группа 18-20 лет",
      AGE_21_25: "возрастная группа 21-25 лет",
      AGE_26_35: "возрастная группа 26-35 лет",
      AGE_36_50: "возрастная группа 36-50 лет",
      OVER_50: "группа старше 50 лет",
    }

    if (maxTypeAge) {
      insights.push(
        `Самое популярное сочетание: ${
          ageGroupNames[maxTypeAge.ageGroup]
        } предпочитают ${tourTypeNames[maxTypeAge.tourType]} (${
          maxTypeAge.count
        } заявок)`
      )
    }

    // Анализ сезонной активности
    const seasonTotals = {}
    Object.entries(seasonGenderData).forEach(([season, genderData]) => {
      seasonTotals[season] =
        (genderData?.MALE || 0) +
        (genderData?.FEMALE || 0) +
        (genderData?.OTHER || 0)
    })

    const mostActiveSeason = Object.entries(seasonTotals).reduce((a, b) =>
      seasonTotals[a[0]] > seasonTotals[b[0]] ? a : b
    )

    if (mostActiveSeason && mostActiveSeason[1] > 0) {
      const seasonName = seasonNames[mostActiveSeason[0]]
      insights.push(
        `Пик активности приходится на ${seasonName} (${mostActiveSeason[1]} заявок)`
      )
    }

    // Добавляем общие рекомендации, если есть данные
    const totalApplications = Object.values(seasonTotals).reduce(
      (a, b) => a + b,
      0
    )
    if (totalApplications > 0) {
      insights.push(
        "Рекомендуется адаптировать маркетинговые кампании под выявленные предпочтения целевых групп"
      )

      if (totalApplications < 50) {
        insights.push(
          "Для более точных выводов рекомендуется собрать больше данных о заявках"
        )
      }
    } else {
      insights.push(
        "Данных о заявках пока недостаточно для формирования выводов"
      )
    }

    return insights
  }

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
              {generateInsights().map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MixedAnalytics
