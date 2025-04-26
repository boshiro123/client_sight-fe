/**
 * Сервис для работы со статистикой
 */
import * as AuthService from "./AuthService"

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

export default {
  getEmployeeStatistics,
}
