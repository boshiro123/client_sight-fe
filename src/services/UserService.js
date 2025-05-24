/**
 * Сервис для работы с пользователями
 */
import * as AuthService from "./AuthService"

const API_BASE_URL = "http://localhost:8080/api"
// const API_BASE_URL = "http://207.180.212.53:8080/api"

/**
 * Обновление профиля пользователя
 * @param {Object} userData - Данные пользователя для обновления
 * @returns {Promise<Object>} - Обновленные данные пользователя
 */
export const updateProfile = async userData => {
  try {
    const currentUser = await AuthService.getCurrentUser()

    // Формируем объект для запроса в соответствии с API
    const requestData = {
      id: currentUser.id,
      fullName: userData.fullName,
      email: currentUser.email,
      role: currentUser.role,
      contact: {
        id: currentUser.contact?.id,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber || "Не указан",
        email: currentUser.email,
        ageGroup: userData.ageGroup || null,
        gender: userData.gender || null,
        preferredTourType: userData.preferredTourType || null,
        discountPercent: currentUser.contact?.discountPercent || 0,
        additionalInfo: userData.additionalInfo || null,
        isClient: currentUser.contact?.isClient || false,
      },
    }

    const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при обновлении профиля")
    }

    const updatedUser = await response.json()

    // Обновляем данные пользователя в localStorage
    AuthService.setUserData(updatedUser)

    return updatedUser
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error)
    throw error
  }
}

/**
 * Мягкое удаление пользователя (создание контакта)
 * @param {number} userId - ID пользователя для мягкого удаления
 * @returns {Promise<void>}
 */
export const softDeleteUser = async userId => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/soft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при удалении пользователя")
    }

    return true
  } catch (error) {
    console.error("Ошибка при мягком удалении пользователя:", error)
    throw error
  }
}

export default {
  updateProfile,
  softDeleteUser,
}
