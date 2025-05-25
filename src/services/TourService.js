/**
 * Сервис для работы с турами
 */
import * as AuthService from "./AuthService"

// const API_BASE_URL = "http://localhost:8080/api"
const API_BASE_URL = "http://207.180.212.53:8080/api"

/**
 * Получение списка всех туров
 * @returns {Promise<Array>} - Массив туров
 */
export const getAllTours = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tours`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении списка туров")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка туров:", error)
    throw error
  }
}

/**
 * Получение информации о туре по ID
 * @param {number} id - ID тура
 * @param {string} contentType - Тип содержимого для возврата (data, image, file)
 * @returns {Promise<Object>} - Данные тура
 */
export const getTourById = async (id, contentType = "data") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tours/${id}?contentType=${contentType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthService.getAuthToken(),
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Ошибка при получении тура с ID: ${id}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Ошибка при получении тура с ID: ${id}:`, error)
    throw error
  }
}

/**
 * Создание нового тура
 * @param {Object} tourData - Данные нового тура
 * @param {File} tourImage - Изображение тура
 * @param {File} tourFile - Файл с описанием тура
 * @returns {Promise<Object>} - Созданный тур
 */
export const createTour = async (tourData, tourImage, tourFile) => {
  try {
    const formData = new FormData()

    // Подготавливаем данные тура с учетом метаданных файлов
    const tourDataWithMeta = {
      ...tourData,
    }

    // Добавляем метаданные изображения, если оно есть
    if (tourImage) {
      tourDataWithMeta.imageName = tourImage.name
      tourDataWithMeta.imageType = tourImage.type
    }

    // Добавляем метаданные файла, если он есть
    if (tourFile) {
      tourDataWithMeta.fileName = tourFile.name
      tourDataWithMeta.fileType = tourFile.type
    }

    // Добавляем данные тура в JSON
    formData.append(
      "tour",
      new Blob([JSON.stringify(tourDataWithMeta)], {
        type: "application/json",
      })
    )

    // Добавляем изображение, если оно есть
    if (tourImage) {
      formData.append("image", tourImage)
    }

    // Добавляем файл, если он есть
    if (tourFile) {
      formData.append("file", tourFile)
    }

    console.log("Отправляемые данные тура:", tourDataWithMeta)

    const response = await fetch(`${API_BASE_URL}/tours`, {
      method: "POST",
      headers: {
        Authorization: AuthService.getAuthToken(),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при создании тура")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при создании тура:", error)
    throw error
  }
}

/**
 * Обновление информации о туре
 * @param {number} id - ID тура
 * @param {Object} tourData - Обновленные данные тура
 * @param {File} tourImage - Изображение тура
 * @param {File} tourFile - Файл с описанием тура
 * @returns {Promise<Object>} - Обновленный тур
 */
export const updateTour = async (id, tourData, tourImage, tourFile) => {
  try {
    const formData = new FormData()

    // Подготавливаем данные тура с учетом метаданных файлов
    const tourDataWithMeta = {
      ...tourData,
    }

    // Добавляем метаданные изображения, если оно есть
    if (tourImage) {
      tourDataWithMeta.imageName = tourImage.name
      tourDataWithMeta.imageType = tourImage.type
    }

    // Добавляем метаданные файла, если он есть
    if (tourFile) {
      tourDataWithMeta.fileName = tourFile.name
      tourDataWithMeta.fileType = tourFile.type
    }

    // Добавляем данные тура в JSON
    formData.append(
      "tour",
      new Blob([JSON.stringify(tourDataWithMeta)], {
        type: "application/json",
      })
    )

    // Добавляем изображение, если оно есть
    if (tourImage) {
      formData.append("image", tourImage)
    }

    // Добавляем файл, если он есть
    if (tourFile) {
      formData.append("file", tourFile)
    }

    console.log("Отправляемые данные тура при обновлении:", tourDataWithMeta)

    const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: "PUT",
      headers: {
        Authorization: AuthService.getAuthToken(),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при обновлении тура")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при обновлении тура:", error)
    throw error
  }
}

/**
 * Удаление тура
 * @param {number} id - ID тура
 * @returns {Promise<void>}
 */
export const deleteTour = async id => {
  try {
    const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthService.getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка при удалении тура с ID: ${id}`)
    }
  } catch (error) {
    console.error(`Ошибка при удалении тура с ID: ${id}:`, error)
    throw error
  }
}

export default {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
}
