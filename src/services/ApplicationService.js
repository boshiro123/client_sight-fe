/**
 * Сервис для работы с заявками на туры
 */
import * as AuthService from "./AuthService"

const API_BASE_URL = "http://localhost:8080/api"
// const API_BASE_URL = "http://207.180.212.53:8080/api"

/**
 * Создание новой заявки на тур
 * @param {Object} applicationData - Данные заявки
 * @returns {Promise<Object>} - Созданная заявка
 */
export const createApplication = async applicationData => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
      body: JSON.stringify(applicationData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при создании заявки на тур")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при создании заявки на тур:", error)
    throw error
  }
}

/**
 * Получение списка заявок пользователя
 * @returns {Promise<Array>} - Массив заявок пользователя
 */
export const getUserApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении списка заявок")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка заявок:", error)
    throw error
  }
}

/**
 * Получение информации о заявке по ID
 * @param {number} id - ID заявки
 * @returns {Promise<Object>} - Данные заявки
 */
export const getApplicationById = async id => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка при получении заявки с ID: ${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Ошибка при получении заявки с ID: ${id}:`, error)
    throw error
  }
}

/**
 * Получение всех заявок (для сотрудников)
 * @returns {Promise<Array>} - Массив всех заявок
 */
export const getAllApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })
    console.log(response)

    if (!response.ok) {
      throw new Error("Ошибка при получении списка всех заявок")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка всех заявок:", error)
    throw error
  }
}

/**
 * Получение списка заявок по email пользователя
 * @param {string} email - Email пользователя
 * @returns {Promise<Array>} - Массив заявок пользователя
 */
export const getApplicationsByEmail = async email => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/by-email?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthService.getAuthToken(),
        },
      }
    )

    if (!response.ok) {
      throw new Error("Ошибка при получении списка заявок пользователя")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка заявок пользователя:", error)
    throw error
  }
}

/**
 * Обновление статуса заявки
 * @param {number} id - ID заявки
 * @param {string} status - Новый статус заявки (PENDING, APPROVED, REJECTED, CANCELLED)
 * @returns {Promise<Object>} - Обновленная заявка
 */
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${id}/status/${status}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthService.getAuthToken(),
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении статуса заявки с ID: ${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заявки с ID: ${id}:`, error)
    throw error
  }
}

export default {
  createApplication,
  getUserApplications,
  getApplicationById,
  getAllApplications,
  getApplicationsByEmail,
  updateApplicationStatus,
}
