/**
 * Сервис для работы со статистикой
 */
import * as AuthService from "./AuthService"
import * as TourService from "./TourService"
import * as ContactService from "./ContactService"
import * as ApplicationService from "./ApplicationService"
import {
  TourSeason,
  TourType,
  AgeGroup,
  Gender,
  ApplicationStatus,
} from "../models/enums"

const API_BASE_URL = "http://localhost:8080/api"

/**
 * Получение статистики для сотрудника
 * @returns {Promise<Object>} - Объект со статистикой
 */
export const getEmployeeStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/employee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении статистики")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении статистики:", error)
    throw error
  }
}

/**
 * Получение аналитических данных о клиентах и контактах
 * @returns {Promise<Object>} - Объект с аналитическими данными
 */
export const getClientAnalytics = async () => {
  try {
    // Получаем всех клиентов
    const tourists = await ContactService.getAllTourists()
    // Получаем все контакты
    const contacts = await ContactService.getAllContacts()
    // Получаем все заявки
    const applications = await ApplicationService.getAllApplications()

    // Статистика по соотношению клиентов и контактов
    const clientsCount = tourists.length
    const contactsCount = contacts.filter(contact => !contact.isClient).length

    // Статистика по полу клиентов
    const genderStats = {
      [Gender.MALE]: 0,
      [Gender.FEMALE]: 0,
      [Gender.OTHER]: 0,
    }

    // Статистика по возрастным группам
    const ageGroupStats = {
      [AgeGroup.UNDER_18]: 0,
      [AgeGroup.AGE_18_20]: 0,
      [AgeGroup.AGE_21_25]: 0,
      [AgeGroup.AGE_26_35]: 0,
      [AgeGroup.AGE_36_50]: 0,
      [AgeGroup.OVER_50]: 0,
    }

    // Статистика по предпочитаемым типам туров
    const preferredTourTypeStats = {
      [TourType.BEACH]: 0,
      [TourType.EXCURSION]: 0,
      [TourType.ADVENTURE]: 0,
      [TourType.SKIING]: 0,
      [TourType.CRUISE]: 0,
      [TourType.CULTURAL]: 0,
      [TourType.MEDICAL]: 0,
      [TourType.EDUCATIONAL]: 0,
    }

    // Постоянные клиенты (с 3+ заявками)
    let regularClientsCount = 0

    // Обрабатываем данные клиентов
    const applicationsByClient = {}
    applications.forEach(app => {
      const clientId = app.tourist?.id
      if (clientId) {
        if (!applicationsByClient[clientId]) {
          applicationsByClient[clientId] = 0
        }
        applicationsByClient[clientId]++
      }
    })

    // Считаем постоянных клиентов (с 3+ заявками)
    Object.values(applicationsByClient).forEach(count => {
      if (count >= 3) {
        regularClientsCount++
      }
    })

    // Собираем статистику по полу и возрасту
    tourists.forEach(tourist => {
      if (tourist.contact) {
        // Гендерная статистика
        if (
          tourist.contact.gender &&
          genderStats.hasOwnProperty(tourist.contact.gender)
        ) {
          genderStats[tourist.contact.gender]++
        }

        // Возрастная статистика
        if (
          tourist.contact.ageGroup &&
          ageGroupStats.hasOwnProperty(tourist.contact.ageGroup)
        ) {
          ageGroupStats[tourist.contact.ageGroup]++
        }

        // Предпочитаемые типы туров
        if (
          tourist.contact.preferredTourType &&
          preferredTourTypeStats.hasOwnProperty(
            tourist.contact.preferredTourType
          )
        ) {
          preferredTourTypeStats[tourist.contact.preferredTourType]++
        }
      }
    })

    return {
      clientsVsContacts: {
        clients: clientsCount,
        contacts: contactsCount,
      },
      genderDistribution: genderStats,
      ageDistribution: ageGroupStats,
      preferredTourTypeDistribution: preferredTourTypeStats,
      regularClients: {
        count: regularClientsCount,
        percentage:
          clientsCount > 0
            ? ((regularClientsCount / clientsCount) * 100).toFixed(2)
            : 0,
      },
    }
  } catch (error) {
    console.error("Ошибка при получении аналитики клиентов:", error)
    throw error
  }
}

/**
 * Получение аналитических данных о турах
 * @returns {Promise<Object>} - Объект с аналитическими данными
 */
export const getTourAnalytics = async () => {
  try {
    // Получаем все туры
    const tours = await TourService.getAllTours()
    // Получаем все заявки
    const applications = await ApplicationService.getAllApplications()

    // Статистика по сезонам туров
    const tourSeasonStats = {
      [TourSeason.WINTER]: 0,
      [TourSeason.SPRING]: 0,
      [TourSeason.SUMMER]: 0,
      [TourSeason.AUTUMN]: 0,
      [TourSeason.ALL_YEAR]: 0,
    }

    // Статистика по типам туров
    const tourTypeStats = {
      [TourType.BEACH]: 0,
      [TourType.EXCURSION]: 0,
      [TourType.ADVENTURE]: 0,
      [TourType.SKIING]: 0,
      [TourType.CRUISE]: 0,
      [TourType.CULTURAL]: 0,
      [TourType.MEDICAL]: 0,
      [TourType.EDUCATIONAL]: 0,
    }

    // Аппроксимация популярности для предсказания
    const seasonTrendData = {
      [TourSeason.WINTER]: [],
      [TourSeason.SPRING]: [],
      [TourSeason.SUMMER]: [],
      [TourSeason.AUTUMN]: [],
      [TourSeason.ALL_YEAR]: [],
    }

    const typeTrendData = {
      [TourType.BEACH]: [],
      [TourType.EXCURSION]: [],
      [TourType.ADVENTURE]: [],
      [TourType.SKIING]: [],
      [TourType.CRUISE]: [],
      [TourType.CULTURAL]: [],
      [TourType.MEDICAL]: [],
      [TourType.EDUCATIONAL]: [],
    }

    // Сопоставляем туры и заявки
    const tourApplicationsMap = {}
    const approvedApplications = applications.filter(
      app => app.status === ApplicationStatus.APPROVED
    )

    approvedApplications.forEach(app => {
      if (app.tourId) {
        if (!tourApplicationsMap[app.tourId]) {
          tourApplicationsMap[app.tourId] = 0
        }
        tourApplicationsMap[app.tourId]++
      }
    })

    // Собираем статистику по турам
    tours.forEach(tour => {
      // Сезоны
      if (tour.season && tourSeasonStats.hasOwnProperty(tour.season)) {
        tourSeasonStats[tour.season]++

        // Для тренда используем количество заявок
        const appCount = tourApplicationsMap[tour.id] || 0
        seasonTrendData[tour.season].push({
          id: tour.id,
          price: tour.price,
          applications: appCount,
          createdAt: tour.createdAt,
        })
      }

      // Типы
      if (tour.type && tourTypeStats.hasOwnProperty(tour.type)) {
        tourTypeStats[tour.type]++

        // Для тренда используем количество заявок
        const appCount = tourApplicationsMap[tour.id] || 0
        typeTrendData[tour.type].push({
          id: tour.id,
          price: tour.price,
          applications: appCount,
          createdAt: tour.createdAt,
        })
      }
    })

    // Расчет тенденций (упрощенная линейная регрессия)
    const seasonPredictions = {}
    const typePredictions = {}

    Object.entries(seasonTrendData).forEach(([season, data]) => {
      // Если есть достаточно данных для прогноза (мин. 3 точки)
      if (data.length >= 3) {
        // Сортировка по дате
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

        // Рассчитываем тренд (упрощенно)
        const firstHalf = data.slice(0, Math.floor(data.length / 2))
        const secondHalf = data.slice(Math.floor(data.length / 2))

        const firstAvg =
          firstHalf.reduce((sum, item) => sum + item.applications, 0) /
          firstHalf.length
        const secondAvg =
          secondHalf.reduce((sum, item) => sum + item.applications, 0) /
          secondHalf.length

        // Тренд: положительный, отрицательный или стабильный
        let trend = "stable"
        let percentage = 0

        if (secondAvg > firstAvg) {
          trend = "increasing"
          percentage =
            firstAvg > 0
              ? (((secondAvg - firstAvg) / firstAvg) * 100).toFixed(2)
              : 100
        } else if (secondAvg < firstAvg) {
          trend = "decreasing"
          percentage =
            firstAvg > 0
              ? (((firstAvg - secondAvg) / firstAvg) * 100).toFixed(2)
              : 0
        }

        seasonPredictions[season] = {
          trend,
          percentage,
          currentAverage: secondAvg.toFixed(2),
        }
      } else {
        seasonPredictions[season] = {
          trend: "insufficient_data",
          percentage: 0,
          currentAverage: 0,
        }
      }
    })

    Object.entries(typeTrendData).forEach(([type, data]) => {
      // Если есть достаточно данных для прогноза (мин. 3 точки)
      if (data.length >= 3) {
        // Сортировка по дате
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

        // Рассчитываем тренд (упрощенно)
        const firstHalf = data.slice(0, Math.floor(data.length / 2))
        const secondHalf = data.slice(Math.floor(data.length / 2))

        const firstAvg =
          firstHalf.reduce((sum, item) => sum + item.applications, 0) /
          firstHalf.length
        const secondAvg =
          secondHalf.reduce((sum, item) => sum + item.applications, 0) /
          secondHalf.length

        // Тренд: положительный, отрицательный или стабильный
        let trend = "stable"
        let percentage = 0

        if (secondAvg > firstAvg) {
          trend = "increasing"
          percentage =
            firstAvg > 0
              ? (((secondAvg - firstAvg) / firstAvg) * 100).toFixed(2)
              : 100
        } else if (secondAvg < firstAvg) {
          trend = "decreasing"
          percentage =
            firstAvg > 0
              ? (((firstAvg - secondAvg) / firstAvg) * 100).toFixed(2)
              : 0
        }

        typePredictions[type] = {
          trend,
          percentage,
          currentAverage: secondAvg.toFixed(2),
        }
      } else {
        typePredictions[type] = {
          trend: "insufficient_data",
          percentage: 0,
          currentAverage: 0,
        }
      }
    })

    return {
      tourSeasonDistribution: tourSeasonStats,
      tourTypeDistribution: tourTypeStats,
      seasonPredictions,
      typePredictions,
    }
  } catch (error) {
    console.error("Ошибка при получении аналитики туров:", error)
    throw error
  }
}

/**
 * Получение аналитических данных о заявках
 * @returns {Promise<Object>} - Объект с аналитическими данными
 */
export const getApplicationAnalytics = async () => {
  try {
    // Получаем все заявки
    const applications = await ApplicationService.getAllApplications()
    // Получаем все туры
    const tours = await TourService.getAllTours()

    // Создаем мапу туров для быстрого доступа
    const toursMap = {}
    tours.forEach(tour => {
      toursMap[tour.id] = tour
    })

    // Статистика по статусам заявок
    const statusStats = {
      [ApplicationStatus.PENDING]: 0,
      [ApplicationStatus.APPROVED]: 0,
      [ApplicationStatus.REJECTED]: 0,
      [ApplicationStatus.CANCELLED]: 0,
    }

    // Статистика по сезонам и типам туров из заявок
    const applicationSeasonStats = {
      [TourSeason.WINTER]: 0,
      [TourSeason.SPRING]: 0,
      [TourSeason.SUMMER]: 0,
      [TourSeason.AUTUMN]: 0,
      [TourSeason.ALL_YEAR]: 0,
    }

    const applicationTypeStats = {
      [TourType.BEACH]: 0,
      [TourType.EXCURSION]: 0,
      [TourType.ADVENTURE]: 0,
      [TourType.SKIING]: 0,
      [TourType.CRUISE]: 0,
      [TourType.CULTURAL]: 0,
      [TourType.MEDICAL]: 0,
      [TourType.EDUCATIONAL]: 0,
    }

    // Данные для смешанной аналитики (сезон + пол, тип + возраст)
    const seasonGenderStats = {}
    const typeAgeStats = {}

    // Инициализируем структуры данных для смешанной аналитики
    Object.values(TourSeason).forEach(season => {
      seasonGenderStats[season] = {
        [Gender.MALE]: 0,
        [Gender.FEMALE]: 0,
        [Gender.OTHER]: 0,
      }
    })

    Object.values(TourType).forEach(type => {
      typeAgeStats[type] = {
        [AgeGroup.UNDER_18]: 0,
        [AgeGroup.AGE_18_20]: 0,
        [AgeGroup.AGE_21_25]: 0,
        [AgeGroup.AGE_26_35]: 0,
        [AgeGroup.AGE_36_50]: 0,
        [AgeGroup.OVER_50]: 0,
      }
    })

    // Собираем статистику по заявкам
    applications.forEach(app => {
      // Статусы заявок
      if (statusStats.hasOwnProperty(app.status)) {
        statusStats[app.status]++
      }

      // Получаем информацию о туре
      const tour = toursMap[app.tourId]
      if (tour) {
        // Сезоны из заявок
        if (tour.season && applicationSeasonStats.hasOwnProperty(tour.season)) {
          applicationSeasonStats[tour.season]++
        }

        // Типы из заявок
        if (tour.type && applicationTypeStats.hasOwnProperty(tour.type)) {
          applicationTypeStats[tour.type]++
        }

        // Смешанная аналитика
        if (app.tourist && app.tourist.contact) {
          const contact = app.tourist.contact

          // Сезон + пол
          if (tour.season && contact.gender) {
            if (
              seasonGenderStats[tour.season] &&
              seasonGenderStats[tour.season][contact.gender]
            ) {
              seasonGenderStats[tour.season][contact.gender]++
            }
          }

          // Тип + возраст
          if (tour.type && contact.ageGroup) {
            if (
              typeAgeStats[tour.type] &&
              typeAgeStats[tour.type][contact.ageGroup]
            ) {
              typeAgeStats[tour.type][contact.ageGroup]++
            }
          }
        }
      }
    })

    return {
      applicationStatusDistribution: statusStats,
      applicationSeasonDistribution: applicationSeasonStats,
      applicationTypeDistribution: applicationTypeStats,
      seasonGenderDistribution: seasonGenderStats,
      typeAgeDistribution: typeAgeStats,
    }
  } catch (error) {
    console.error("Ошибка при получении аналитики заявок:", error)
    throw error
  }
}

export default {
  getEmployeeStatistics,
  getClientAnalytics,
  getTourAnalytics,
  getApplicationAnalytics,
}
