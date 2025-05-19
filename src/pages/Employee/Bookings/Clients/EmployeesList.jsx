import React, { useState } from "react"
import * as AuthService from "../../../../services/AuthService"
import "./EmployeesList.css"

const EmployeesList = ({ employees, loading, error, refreshData }) => {
  const [showForm, setShowForm] = useState(false)
  const [operationSuccess, setOperationSuccess] = useState(null)
  const [operationError, setOperationError] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateEmployee = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setFormData({
      fullName: "",
      email: "",
    })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      // Создание сотрудника через API
      await AuthService.createEmployee(formData)

      setOperationSuccess("Сотрудник успешно создан")
      setTimeout(() => {
        setOperationSuccess(null)
      }, 3000)

      // Закрыть форму и обновить список
      handleCloseForm()
      if (refreshData) {
        refreshData()
      }
    } catch (err) {
      console.error("Ошибка при создании сотрудника:", err)
      setOperationError(
        "Не удалось создать сотрудника. Пожалуйста, проверьте данные и попробуйте снова."
      )
      setTimeout(() => {
        setOperationError(null)
      }, 5000)
    }
  }

  const handleDeleteClick = employee => {
    setEmployeeToDelete(employee)
    setShowDeleteConfirm(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setEmployeeToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return

    setIsDeleting(true)
    try {
      await AuthService.deleteUser(employeeToDelete.id)

      setOperationSuccess(
        `Сотрудник ${employeeToDelete.fullName} успешно удален`
      )
      setTimeout(() => {
        setOperationSuccess(null)
      }, 3000)

      setShowDeleteConfirm(false)
      setEmployeeToDelete(null)

      if (refreshData) {
        refreshData()
      }
    } catch (err) {
      console.error("Ошибка при удалении сотрудника:", err)
      setOperationError(
        "Не удалось удалить сотрудника. Пожалуйста, попробуйте позже."
      )
      setTimeout(() => {
        setOperationError(null)
      }, 5000)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Загрузка сотрудников...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="employees-list">
      <div className="employees-header">
        <h2 className="section-title">Сотрудники ({employees.length})</h2>
        <button className="add-employee-button" onClick={handleCreateEmployee}>
          Добавить сотрудника
        </button>
      </div>

      {operationSuccess && (
        <div className="operation-success-message">{operationSuccess}</div>
      )}

      {operationError && (
        <div className="operation-error-message">{operationError}</div>
      )}

      {showForm && (
        <div className="employee-form-container">
          <div className="employee-form">
            <div className="form-header">
              <h3>Создание сотрудника</h3>
              <button className="close-button" onClick={handleCloseForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Полное имя</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseForm}
                >
                  Отмена
                </button>
                <button type="submit" className="submit-button">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && employeeToDelete && (
        <div className="delete-confirm-container">
          <div className="delete-confirm-dialog">
            <div className="delete-confirm-header">
              <h3>Подтверждение удаления</h3>
              <button className="close-button" onClick={handleCancelDelete}>
                ×
              </button>
            </div>
            <div className="delete-confirm-content">
              <p>
                Вы уверены, что хотите удалить сотрудника:{" "}
                <strong>{employeeToDelete.fullName}</strong>?
              </p>
              <p className="delete-confirm-warning">
                Это действие нельзя отменить.
              </p>
            </div>
            <div className="delete-confirm-actions">
              <button
                className="cancel-button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Отмена
              </button>
              <button
                className="delete-button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {employees.length === 0 ? (
        <div className="no-data-message">Сотрудники не найдены</div>
      ) : (
        <div className="employee-cards">
          {employees.map(employee => (
            <div key={employee.id} className="employee-card">
              <div className="employee-header">
                <h3 className="employee-name">{employee.fullName}</h3>
                <div className="employee-status">
                  <span className="status-badge employee-role">Сотрудник</span>
                </div>
              </div>

              <div className="employee-info">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    {employee.email || "Не указан"}
                  </span>
                </div>

                {employee.contact && employee.contact.phoneNumber && (
                  <div className="info-row">
                    <span className="info-label">Телефон:</span>
                    <span className="info-value">
                      {employee.contact.phoneNumber}
                    </span>
                  </div>
                )}

                <div className="info-row">
                  <span className="info-label">Дата создания:</span>
                  <span className="info-value">
                    {new Date(employee.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>

              <div className="employee-actions">
                <button
                  className="action-button delete-employee"
                  onClick={() => handleDeleteClick(employee)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeesList
