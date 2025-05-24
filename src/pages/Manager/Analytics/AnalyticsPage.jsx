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

        // Загружаем данные аналитики из реальных API
        const [clientData, tourData, applicationData] = await Promise.all([
          StatisticsService.getClientAnalytics(),
          StatisticsService.getTourAnalytics(),
          StatisticsService.getApplicationAnalytics(),
        ])

        // Проверяем, что данные получены корректно
        if (!clientData || !tourData || !applicationData) {
          throw new Error("Получены неполные данные аналитики")
        }

        setClientAnalytics(clientData)
        setTourAnalytics(tourData)
        setApplicationAnalytics(applicationData)

        setIsLoading(false)
      } catch (error) {
        console.error("Ошибка при получении данных:", error)
        setError(
          "Не удалось загрузить данные аналитики. Пожалуйста, попробуйте позже."
        )
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
      const fileName = `clientsight-analytics-${new Date()
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
            <div className="analytics-loading">
              Загрузка данных аналитики...
            </div>
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
                  <MixedAnalytics data={applicationAnalytics} />
                )}
              </div>
            </>
          ) : (
            <div className="analytics-error">
              Не удалось загрузить данные пользователя.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnalyticsPage
