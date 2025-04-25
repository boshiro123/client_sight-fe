/**
 * Сервис для работы с контактами
 */
import * as AuthService from "./AuthService"

const API_BASE_URL = "http://localhost:8080/api"

/**
 * Получение всех контактов
 * @returns {Promise<Array>} - Массив всех контактов
 */
export const getAllContacts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении списка контактов")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка контактов:", error)
    throw error
  }
}

/**
 * Получение всех туристов (клиентов)
 * @returns {Promise<Array>} - Массив всех туристов
 */
export const getAllTourists = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/all-tourists`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении списка клиентов")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка клиентов:", error)
    throw error
  }
}

/**
 * Создание нового контакта
 * @param {Object} contactData - Данные контакта
 * @returns {Promise<Object>} - Созданный контакт
 */
export const createContact = async contactData => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
      body: JSON.stringify(contactData),
    })

    if (!response.ok) {
      throw new Error("Ошибка при создании контакта")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при создании контакта:", error)
    throw error
  }
}

/**
 * Обновление контакта
 * @param {number} id - ID контакта
 * @param {Object} contactData - Обновленные данные контакта
 * @returns {Promise<Object>} - Обновленный контакт
 */
export const updateContact = async (id, contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
      body: JSON.stringify(contactData),
    })

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении контакта с ID: ${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Ошибка при обновлении контакта с ID: ${id}:`, error)
    throw error
  }
}

/**
 * Создание пользователя из контакта
 * @param {Object} contactData - Данные контакта
 * @returns {Promise<Object>} - Созданный пользователь с данными контакта
 */
export const createUserFromContact = async contactData => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/create-user-from-contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthService.getAuthToken(),
        },
        body: JSON.stringify(contactData),
      }
    )

    if (!response.ok) {
      throw new Error("Ошибка при создании пользователя из контакта")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при создании пользователя из контакта:", error)
    throw error
  }
}

export default {
  getAllContacts,
  getAllTourists,
  createContact,
  updateContact,
  createUserFromContact,
}
