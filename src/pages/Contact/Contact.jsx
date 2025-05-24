import React, { useState } from "react"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import "./Contact.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage(
        "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время."
      )
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      setTimeout(() => setSubmitMessage(""), 5000)
    }, 1000)
  }

  return (
    <div className="contact-page">
      <Header />

      <main className="main-content">
        <section className="page-hero">
          <div className="container">
            <h1>Контакты</h1>
            <p>
              Свяжитесь с нами для планирования вашего незабываемого путешествия
            </p>
          </div>
        </section>

        <section className="contact-info">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-details">
                <h2>Наши офисы в Беларуси</h2>

                <div className="office">
                  <h3>Главный офис - Минск</h3>
                  <div className="office-info">
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span>пр. Независимости, 95, офис 412, Минск 220050</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📞</span>
                      <span>+375 (17) 123-45-67</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📱</span>
                      <span>+375 (29) 123-45-67 (МТС)</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📱</span>
                      <span>+375 (25) 123-45-67 (life:)</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">✉️</span>
                      <span>info@clientsight.by</span>
                    </div>
                  </div>
                </div>

                <div className="office">
                  <h3>Офис в Гродно</h3>
                  <div className="office-info">
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span>ул. Советская, 4, офис 210, Гродно 230025</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📞</span>
                      <span>+375 (152) 98-76-54</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">✉️</span>
                      <span>grodno@clientsight.by</span>
                    </div>
                  </div>
                </div>

                <div className="office">
                  <h3>Офис в Бресте</h3>
                  <div className="office-info">
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <span>бул. Шевченко, 15, офис 305, Брест 224016</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📞</span>
                      <span>+375 (162) 87-65-43</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">✉️</span>
                      <span>brest@clientsight.by</span>
                    </div>
                  </div>
                </div>

                <div className="working-hours">
                  <h3>Режим работы</h3>
                  <div className="hours-grid">
                    <div className="hours-item">
                      <span className="day">Понедельник - Пятница:</span>
                      <span className="time">9:00 - 18:00</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Суббота:</span>
                      <span className="time">10:00 - 15:00</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Воскресенье:</span>
                      <span className="time">Выходной</span>
                    </div>
                  </div>
                </div>

                <div className="social-media">
                  <h3>Мы в социальных сетях</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <span className="icon">📘</span>
                      <span>Facebook</span>
                    </a>
                    <a href="#" className="social-link">
                      <span className="icon">📷</span>
                      <span>Instagram</span>
                    </a>
                    <a href="#" className="social-link">
                      <span className="icon">✈️</span>
                      <span>Telegram</span>
                    </a>
                    <a href="#" className="social-link">
                      <span className="icon">📹</span>
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-form-section">
                <h2>Напишите нам</h2>
                <p>
                  Заполните форму ниже, и мы свяжемся с вами в ближайшее время
                </p>

                {submitMessage && (
                  <div className="success-message">{submitMessage}</div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Имя *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+375 (XX) XXX-XX-XX"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Тема</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                      >
                        <option value="">Выберите тему</option>
                        <option value="tour-info">Информация о турах</option>
                        <option value="booking">Бронирование</option>
                        <option value="complaint">Жалоба</option>
                        <option value="suggestion">Предложение</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Сообщение *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Расскажите нам о ваших пожеланиях или вопросах..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Отправляем..." : "Отправить сообщение"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="emergency-contact">
          <div className="container">
            <div className="emergency-card">
              <h2>Экстренная связь</h2>
              <p>
                Если вы находитесь в туре и у вас возникла экстренная ситуация,
                свяжитесь с нашей службой поддержки 24/7:
              </p>
              <div className="emergency-info">
                <div className="emergency-item">
                  <span className="icon">🚨</span>
                  <div>
                    <strong>Горячая линия:</strong>
                    <span>+375 (29) 911-24-24</span>
                  </div>
                </div>
                <div className="emergency-item">
                  <span className="icon">📧</span>
                  <div>
                    <strong>Email:</strong>
                    <span>emergency@clientsight.by</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
