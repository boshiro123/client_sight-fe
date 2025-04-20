import React from "react"
import { Link } from "react-router-dom"
import "./Header.css"

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">ClientSight</Link>
        </div>
        <nav className="header-nav">
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/tours">Туры</Link>
            </li>
            <li>
              <Link to="/about">О компании</Link>
            </li>
          </ul>
        </nav>
        <div className="header-auth">
          <Link to="/login" className="auth-button login">
            Вход
          </Link>
          <Link to="/register" className="auth-button register">
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
