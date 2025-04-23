import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import * as AuthService from "../../../services/AuthService"
import * as TourService from "../../../services/TourService"
import TourList from "./components/TourList"
import TourForm from "./components/TourForm"
import "./ToursPage.css"

const ToursPage = () => {
  const [userData, setUserData] = useState(null)
  const [tours, setTours] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          navigate("/login")
          return
        }

        const user = await AuthService.getCurrentUser()
        if (user.role !== "EMPLOYEE") {
          navigate("/")
          return
        }

        setUserData(user)
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error)
        navigate("/login")
      }
    }

    checkAuth()
  }, [navigate])

  useEffect(() => {
    const fetchTours = async () => {
      if (!userData) return

      setIsLoading(true)
      setError(null)

      try {
        const toursData = await TourService.getAllTours()
        setTours(toursData)
      } catch (error) {
        console.error("Ошибка при получении списка туров:", error)
        setError(
          "Не удалось загрузить список туров. Пожалуйста, попробуйте позже."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTours()
  }, [userData])

  const handleCreateTour = () => {
    setSelectedTour(null)
    setShowForm(true)
  }

  const handleEditTour = tour => {
    setSelectedTour(tour)
    setShowForm(true)
  }

  const handleDeleteTour = async tourId => {
    if (window.confirm("Вы действительно хотите удалить этот тур?")) {
      setIsLoading(true)

      try {
        await TourService.deleteTour(tourId)
        setTours(tours.filter(tour => tour.id !== tourId))
      } catch (error) {
        console.error("Ошибка при удалении тура:", error)
        setError("Не удалось удалить тур. Пожалуйста, попробуйте позже.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmitForm = async (formData, tourImage, tourFile) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("FormData:", formData)
      console.log(
        "TourImage:",
        tourImage
          ? { name: tourImage.name, type: tourImage.type, size: tourImage.size }
          : null
      )
      console.log(
        "TourFile:",
        tourFile
          ? { name: tourFile.name, type: tourFile.type, size: tourFile.size }
          : null
      )

      if (selectedTour) {
        // Обновление существующего тура
        const updatedTour = await TourService.updateTour(
          selectedTour.id,
          formData,
          tourImage,
          tourFile
        )

        setTours(
          tours.map(tour => (tour.id === updatedTour.id ? updatedTour : tour))
        )
      } else {
        // Создание нового тура
        const newTour = await TourService.createTour(
          formData,
          tourImage,
          tourFile
        )

        setTours([...tours, newTour])
      }

      setShowForm(false)
      setSelectedTour(null)
    } catch (error) {
      console.error("Ошибка при сохранении тура:", error)
      setError(
        "Не удалось сохранить тур. Пожалуйста, проверьте данные и попробуйте снова."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setSelectedTour(null)
  }

  return (
    <div className="tours-page">
      <Header />

      <main className="tours-main">
        <div className="tours-container">
          <h1 className="tours-title">Управление турами</h1>

          {error && <div className="tours-error">{error}</div>}

          {!showForm ? (
            <div className="tours-content">
              <div className="tours-actions">
                <button
                  className="create-tour-button"
                  onClick={handleCreateTour}
                >
                  Создать новый тур
                </button>
              </div>

              {isLoading ? (
                <div className="tours-loading">Загрузка туров...</div>
              ) : (
                <TourList
                  tours={tours}
                  onEdit={handleEditTour}
                  onDelete={handleDeleteTour}
                />
              )}
            </div>
          ) : (
            <TourForm
              tour={selectedTour}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              isSubmitting={isLoading}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ToursPage
