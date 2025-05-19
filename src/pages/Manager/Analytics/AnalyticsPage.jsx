import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import * as StatisticsService from "../../../services/StatisticsService"
import {
  TourSeason,
  TourType,
  AgeGroup,
  Gender,
  ApplicationStatus,
} from "../../../models/enums"
import ClientAnalytics from "./ClientAnalytics"
import TourAnalytics from "./TourAnalytics"
import ApplicationAnalytics from "./ApplicationAnalytics"
import MixedAnalytics from "./MixedAnalytics"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import "./AnalyticsPage.css"

// Статические данные для аналитики клиентов
const staticClientAnalytics = {
  clientsVsContacts: {
    clients: 345,
    contacts: 520,
  },
  genderDistribution: {
    MALE: 215,
    FEMALE: 280,
    OTHER: 25,
  },
  ageDistribution: {
    UNDER_18: 40,
    AGE_18_20: 85,
    AGE_21_25: 130,
    AGE_26_35: 165,
    AGE_36_50: 75,
    OVER_50: 25,
  },
  preferredTourTypeDistribution: {
    BEACH: 180,
    EXCURSION: 130,
    ADVENTURE: 95,
    SKIING: 50,
    CRUISE: 75,
    CULTURAL: 130,
    MEDICAL: 40,
    EDUCATIONAL: 30,
  },
  regularClients: {
    count: 87,
    percentage: 25.2,
  },
}

// Статические данные для аналитики туров
const staticTourAnalytics = {
  tourSeasonDistribution: {
    WINTER: 45,
    SPRING: 60,
    SUMMER: 90,
    AUTUMN: 55,
    ALL_YEAR: 35,
  },
  tourTypeDistribution: {
    BEACH: 65,
    EXCURSION: 75,
    ADVENTURE: 45,
    SKIING: 25,
    CRUISE: 30,
    CULTURAL: 50,
    MEDICAL: 15,
    EDUCATIONAL: 10,
  },
  // Данные для прогнозов
  seasonPredictions: {
    WINTER: { trend: "increasing", percentage: 12.5 },
    SPRING: { trend: "stable", percentage: 0 },
    SUMMER: { trend: "increasing", percentage: 18.3 },
    AUTUMN: { trend: "decreasing", percentage: 5.7 },
    ALL_YEAR: { trend: "increasing", percentage: 8.2 },
  },
  typePredictions: {
    BEACH: { trend: "increasing", percentage: 15.2 },
    EXCURSION: { trend: "stable", percentage: 0 },
    ADVENTURE: { trend: "increasing", percentage: 22.8 },
    SKIING: { trend: "decreasing", percentage: 7.3 },
    CRUISE: { trend: "increasing", percentage: 12.5 },
    CULTURAL: { trend: "stable", percentage: 0 },
    MEDICAL: { trend: "increasing", percentage: 5.1 },
    EDUCATIONAL: { trend: "stable", percentage: 0 },
  },
}

// Статические данные для аналитики заявок
const staticApplicationAnalytics = {
  applicationStatusDistribution: {
    PENDING: 95,
    APPROVED: 320,
    REJECTED: 65,
    CANCELLED: 45,
  },
  applicationSeasonDistribution: {
    WINTER: 90,
    SPRING: 110,
    SUMMER: 185,
    AUTUMN: 105,
    ALL_YEAR: 35,
  },
  applicationTypeDistribution: {
    BEACH: 140,
    EXCURSION: 125,
    ADVENTURE: 85,
    SKIING: 40,
    CRUISE: 60,
    CULTURAL: 90,
    MEDICAL: 25,
    EDUCATIONAL: 20,
  },
  // Дополнительные данные для смешанной аналитики
  seasonGenderDistribution: {
    WINTER: { MALE: 42, FEMALE: 45, OTHER: 3 },
    SPRING: { MALE: 53, FEMALE: 54, OTHER: 3 },
    SUMMER: { MALE: 85, FEMALE: 95, OTHER: 5 },
    AUTUMN: { MALE: 45, FEMALE: 57, OTHER: 3 },
    ALL_YEAR: { MALE: 15, FEMALE: 19, OTHER: 1 },
  },
  typeAgeDistribution: {
    BEACH: {
      UNDER_18: 10,
      AGE_18_20: 25,
      AGE_21_25: 35,
      AGE_26_35: 40,
      AGE_36_50: 20,
      OVER_50: 10,
    },
    EXCURSION: {
      UNDER_18: 15,
      AGE_18_20: 15,
      AGE_21_25: 30,
      AGE_26_35: 35,
      AGE_36_50: 20,
      OVER_50: 10,
    },
    ADVENTURE: {
      UNDER_18: 10,
      AGE_18_20: 20,
      AGE_21_25: 25,
      AGE_26_35: 20,
      AGE_36_50: 7,
      OVER_50: 3,
    },
    SKIING: {
      UNDER_18: 5,
      AGE_18_20: 10,
      AGE_21_25: 10,
      AGE_26_35: 10,
      AGE_36_50: 3,
      OVER_50: 2,
    },
    CRUISE: {
      UNDER_18: 3,
      AGE_18_20: 5,
      AGE_21_25: 15,
      AGE_26_35: 20,
      AGE_36_50: 12,
      OVER_50: 5,
    },
    CULTURAL: {
      UNDER_18: 5,
      AGE_18_20: 10,
      AGE_21_25: 15,
      AGE_26_35: 25,
      AGE_36_50: 20,
      OVER_50: 15,
    },
    MEDICAL: {
      UNDER_18: 2,
      AGE_18_20: 2,
      AGE_21_25: 3,
      AGE_26_35: 5,
      AGE_36_50: 8,
      OVER_50: 5,
    },
    EDUCATIONAL: {
      UNDER_18: 5,
      AGE_18_20: 5,
      AGE_21_25: 5,
      AGE_26_35: 3,
      AGE_36_50: 1,
      OVER_50: 1,
    },
  },
}

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("clients")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  // Состояния для хранения данных аналитики
  const [clientAnalytics, setClientAnalytics] = useState(null)
  const [tourAnalytics, setTourAnalytics] = useState(null)
  const [applicationAnalytics, setApplicationAnalytics] = useState(null)

  const navigate = useNavigate()
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Проверяем, авторизован ли пользователь
        if (!AuthService.isAuthenticated()) {
          navigate("/login")
          return
        }

        // Получаем данные пользователя
        const user = await AuthService.getCurrentUser()

        // Проверяем роль пользователя
        if (user.role !== "MANAGER") {
          navigate("/")
          return
        }

        setUserData(user)

        // Загружаем данные аналитики
        // Используем статические данные вместо вызова API
        setClientAnalytics(staticClientAnalytics)
        setTourAnalytics(staticTourAnalytics)
        setApplicationAnalytics(staticApplicationAnalytics)

        setIsLoading(false)
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error)
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.")
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleTabChange = tab => {
    setActiveTab(tab)
  }

  const generatePDF = async () => {
    if (!contentRef.current) return

    const content = contentRef.current

    try {
      // Создаем временное сообщение о загрузке
      const loadingElement = document.createElement("div")
      loadingElement.className = "generating-pdf-message"
      loadingElement.innerText = "Создание PDF..."
      document.body.appendChild(loadingElement)

      // Используем html2canvas для создания изображения
      const canvas = await html2canvas(content, {
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/png")

      // Создаем документ PDF
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210 // A4 ширина в мм
      const pageHeight = 297 // A4 высота в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Если контент не помещается на одной странице, добавляем новые
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Имя файла с текущей датой
      const fileName = `clientsight-analitycs-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`

      // Удаляем сообщение о загрузке
      document.body.removeChild(loadingElement)

      // Сохраняем файл
      pdf.save(fileName)
    } catch (error) {
      console.error("Ошибка при создании PDF:", error)
      alert("Не удалось создать PDF. Пожалуйста, попробуйте еще раз.")
    }
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case "clients":
        return "Аналитика по клиентам"
      case "tours":
        return "Аналитика по турам"
      case "applications":
        return "Аналитика по заявкам"
      case "mixed":
        return "Смешанная аналитика"
      default:
        return "Аналитика"
    }
  }

  return (
    <div className="analytics-page">
      <Helmet>
        <title>Аналитика | Панель менеджера</title>
      </Helmet>

      <Header />

      <main className="analytics-main">
        <div className="analytics-container">
          <h1 className="analytics-title">Бизнес-аналитика</h1>

          {isLoading ? (
            <div className="analytics-loading">Загрузка данных...</div>
          ) : error ? (
            <div className="analytics-error">{error}</div>
          ) : userData ? (
            <>
              <div className="analytics-tabs">
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
                    activeTab === "tours" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("tours")}
                >
                  Туры
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "applications" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("applications")}
                >
                  Заявки
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "mixed" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("mixed")}
                >
                  Комбинированная аналитика
                </button>
              </div>

              <div className="analytics-actions">
                <h2 className="section-title">{getTabTitle()}</h2>
                <button className="export-pdf-button" onClick={generatePDF}>
                  Экспорт в PDF
                </button>
              </div>

              <div className="analytics-content" ref={contentRef}>
                {activeTab === "clients" && clientAnalytics && (
                  <ClientAnalytics data={clientAnalytics} />
                )}

                {activeTab === "tours" && tourAnalytics && (
                  <TourAnalytics data={tourAnalytics} />
                )}

                {activeTab === "applications" && applicationAnalytics && (
                  <ApplicationAnalytics data={applicationAnalytics} />
                )}

                {activeTab === "mixed" && applicationAnalytics && (
                  <MixedAnalytics
                    seasonGenderData={
                      applicationAnalytics.seasonGenderDistribution
                    }
                    typeAgeData={applicationAnalytics.typeAgeDistribution}
                  />
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnalyticsPage
