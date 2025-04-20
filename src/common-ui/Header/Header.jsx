import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as AuthService from "../../services/AuthService"
import "./Header.css"

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = AuthService.isAuthenticated()
      setIsAuthenticated(authStatus)

      if (authStatus) {
        try {
          const user = await AuthService.getCurrentUser()
          setUserData(user)
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error)
        }
      }
    }

    checkAuthStatus()
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setUserData(null)
    navigate("/login")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigateToProfile = () => {
    if (userData && userData.role === "TOURIST") {
      navigate("/tourist/profile")
    } else if (userData && userData.role === "EMPLOYEE") {
      navigate("/employee/dashboard")
    } else if (userData && userData.role === "MANAGER") {
      navigate("/manager/dashboard")
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <h1>ClientSight</h1>
          </Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Главная
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tours" className="nav-link">
                Туры
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                О нас
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Контакты
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-auth">
          {isAuthenticated ? (
            <div className="auth-user">
              {userData && userData.role === "TOURIST" && (
                <button className="profile-button" onClick={navigateToProfile}>
                  Профиль
                </button>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Войти
              </Link>
              <Link to="/register" className="register-button">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
