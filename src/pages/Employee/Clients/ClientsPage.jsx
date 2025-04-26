import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import ClientsList from "./ClientsList"
import ContactsList from "./ContactsList"
import EmployeesList from "./EmployeesList"
import * as ContactService from "../../../services/ContactService"
import * as AuthService from "../../../services/AuthService"
import "./ClientsPage.css"

const ClientsPage = () => {
  const [tourists, setTourists] = useState([])
  const [contacts, setContacts] = useState([])
  const [employees, setEmployees] = useState([])
  const [loadingTourists, setLoadingTourists] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("clients") // "clients", "contacts" или "employees"
  const [currentUser, setCurrentUser] = useState(null)
  const [isManager, setIsManager] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser()
        setCurrentUser(user)
        setIsManager(user.role === "MANAGER")
      } catch (err) {
        console.error("Ошибка при получении данных пользователя:", err)
      }
    }

    fetchCurrentUser()
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError(null)
      await Promise.all([fetchTourists(), fetchContacts()])

      // Если пользователь - менеджер, также загружаем сотрудников
      const user = await AuthService.getCurrentUser()
      if (user.role === "MANAGER") {
        setIsManager(true)
        await fetchEmployees()
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err)
      setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.")
    }
  }

  const fetchTourists = async () => {
    try {
      setLoadingTourists(true)
      const data = await ContactService.getAllTourists()
      setTourists(data)
    } catch (err) {
      console.error("Ошибка при загрузке клиентов:", err)
      throw err
    } finally {
      setLoadingTourists(false)
    }
  }

  const fetchContacts = async () => {
    try {
      setLoadingContacts(true)
      const data = await ContactService.getAllContacts()

      // Фильтруем контакты, исключая тех, кто уже является клиентом с аккаунтом
      const filteredContacts = data.filter(contact => !contact.isClient)
      setContacts(filteredContacts)
    } catch (err) {
      console.error("Ошибка при загрузке контактов:", err)
      throw err
    } finally {
      setLoadingContacts(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const data = await AuthService.getEmployees()
      setEmployees(data)
    } catch (err) {
      console.error("Ошибка при загрузке сотрудников:", err)
      throw err
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleTabChange = tab => {
    setActiveTab(tab)
  }

  return (
    <div className="clients-page">
      <Helmet>
        <title>
          {isManager
            ? "Клиенты, контакты и сотрудники | Панель менеджера"
            : "Клиенты и контакты | Панель сотрудника"}
        </title>
      </Helmet>

      <Header />

      <main className="clients-main">
        <div className="clients-container">
          <h1 className="page-title">
            {isManager
              ? "Клиенты, контакты и сотрудники"
              : "Клиенты и контакты"}
          </h1>

          {error && <div className="error-message">{error}</div>}

          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab-button ${
                  activeTab === "clients" ? "active" : ""
                }`}
                onClick={() => handleTabChange("clients")}
              >
                Клиенты
              </button>
              <button
                className={`tab-button ${
                  activeTab === "contacts" ? "active" : ""
                }`}
                onClick={() => handleTabChange("contacts")}
              >
                Контакты
              </button>
              {isManager && (
                <button
                  className={`tab-button ${
                    activeTab === "employees" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("employees")}
                >
                  Сотрудники
                </button>
              )}
            </div>

            <div className="refresh-button-container">
              <button className="refresh-button" onClick={fetchData}>
                Обновить данные
              </button>
            </div>
          </div>

          <div className="tab-content">
            {activeTab === "clients" ? (
              <ClientsList
                tourists={tourists}
                loading={loadingTourists}
                error={error}
                refreshData={fetchTourists}
              />
            ) : activeTab === "contacts" ? (
              <ContactsList
                contacts={contacts}
                loading={loadingContacts}
                error={error}
                refreshContacts={fetchContacts}
              />
            ) : (
              isManager && (
                <EmployeesList
                  employees={employees}
                  loading={loadingEmployees}
                  error={error}
                  refreshData={fetchEmployees}
                />
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ClientsPage
