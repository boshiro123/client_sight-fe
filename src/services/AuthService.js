/**
 * Сервис для работы с аутентификацией
 */
// const API_BASE_URL = "http://localhost:8080/api"
const API_BASE_URL = "http://207.180.212.53:8080/api"

/**
 * Вход пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} - Данные с токеном
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при входе в систему")
    }

    const data = await response.json()
    // Сохраняем токен и userId в localStorage для последующих запросов
    saveAuthToken(data.token, data.tokenType, data.userId)
    return data
  } catch (error) {
    console.error("Ошибка при входе:", error)
    throw error
  }
}

/**
 * Регистрация нового пользователя
 * @param {string} fullName - Полное имя пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} - Данные с токеном нового пользователя
 */
export const register = async (fullName, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при регистрации")
    }

    const data = await response.json()
    // Мы не сохраняем токен после регистрации, т.к. пользователь должен перейти на страницу входа
    return data
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    throw error
  }
}

/**
 * Получить информацию о текущем пользователе
 * @returns {Promise<Object>} - Данные пользователя
 */
export const getCurrentUser = async () => {
  try {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      throw new Error("Пользователь не авторизован")
    }

    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении данных пользователя")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error)
    throw error
  }
}

/**
 * Создание нового сотрудника
 * @param {Object} employeeData - Данные сотрудника (fullName, email)
 * @returns {Promise<Object>} - Данные созданного сотрудника
 */
export const createEmployee = async employeeData => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/create-employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthToken(),
      },
      body: JSON.stringify({
        fullName: employeeData.fullName,
        email: employeeData.email,
        role: "EMPLOYEE",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при создании сотрудника")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при создании сотрудника:", error)
    throw error
  }
}

/**
 * Получить список всех сотрудников
 * @returns {Promise<Array>} - Список сотрудников
 */
export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/all-employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthToken(),
      },
    })

    if (!response.ok) {
      throw new Error("Ошибка при получении списка сотрудников")
    }

    return await response.json()
  } catch (error) {
    console.error("Ошибка при получении списка сотрудников:", error)
    throw error
  }
}

/**
 * Удаление пользователя по ID
 * @param {number} userId - ID пользователя для удаления
 * @returns {Promise<void>}
 */
export const deleteUser = async userId => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthToken(),
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка при удалении пользователя")
    }

    return true
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error)
    throw error
  }
}

/**
 * Выход пользователя
 */
export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("tokenType")
  localStorage.removeItem("userId")
}

/**
 * Сохранение токена аутентификации и userId в localStorage
 * @param {string} token - JWT токен
 * @param {string} tokenType - Тип токена (Bearer)
 * @param {number} userId - ID пользователя
 */
export const saveAuthToken = (token, tokenType, userId) => {
  localStorage.setItem("token", token)
  localStorage.setItem("tokenType", tokenType)
  if (userId) {
    localStorage.setItem("userId", userId)
  }
}

/**
 * Получение токена аутентификации из localStorage
 * @returns {string|null} - Токен с префиксом типа или null
 */
export const getAuthToken = () => {
  const token = localStorage.getItem("token")
  const tokenType = localStorage.getItem("tokenType")

  if (token && tokenType) {
    return `${tokenType} ${token}`
  }
  return null
}

/**
 * Проверка, авторизован ли пользователь
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getAuthToken()
}

/**
 * Получение ID пользователя из localStorage
 * @returns {number|null} - ID пользователя или null
 */
export const getUserId = () => {
  const userId = localStorage.getItem("userId")
  return userId ? parseInt(userId) : null
}

/**
 * Обновление данных пользователя в localStorage
 * @param {Object} userData - Обновленные данные пользователя
 */
export const setUserData = userData => {
  try {
    localStorage.setItem("user", JSON.stringify(userData))
  } catch (error) {
    console.error("Ошибка при сохранении данных пользователя:", error)
  }
}

export default {
  login,
  register,
  logout,
  getAuthToken,
  isAuthenticated,
  getCurrentUser,
  getUserId,
  setUserData,
  createEmployee,
  getEmployees,
  deleteUser,
}
