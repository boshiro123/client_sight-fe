import React from "react"
import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>О компании</h3>
          <p>
            ClientSight - современная система управления туристическими
            компаниями, клиентской базой и аналитикой.
          </p>
        </div>
        <div className="footer-section">
          <h3>Разделы</h3>
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
        </div>
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Адрес: пр. Независимости, 95, офис 412</p>
          <p>Телефон: +375 (17) 123-45-67</p>
          <p>Email: info@clientsight.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} ClientSight. Все права защищены.
        </p>
      </div>
    </footer>
  )
}

export default Footer
