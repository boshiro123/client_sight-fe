import React from "react"
import Header from "../../common-ui/Header"
import Footer from "../../common-ui/Footer"
import "./About.css"

const About = () => {
  return (
    <div className="about-page">
      <Header />

      <main className="main-content">
        <section className="page-hero">
          <div className="container">
            <h1>О компании ClientSight</h1>
            <p>
              Ваш надежный партнер в мире путешествий по Беларуси и за её
              пределами
            </p>
          </div>
        </section>

        <section className="company-info">
          <div className="container">
            <div className="info-grid">
              <div className="info-text">
                <h2>Наша история</h2>
                <p>
                  Туристическая компания ClientSight была основана в 2014 году в
                  Минске с целью популяризации внутреннего туризма Беларуси и
                  организации качественных международных поездок для белорусов.
                </p>
                <p>
                  За 10 лет работы мы организовали более 5000 туров, познакомили
                  тысячи путешественников с красотами белорусской природы и
                  помогли открыть для себя удивительные места по всему миру.
                </p>

                <h2>Наши преимущества</h2>
                <ul className="advantages-list">
                  <li>Глубокое знание туристических маршрутов Беларуси</li>
                  <li>Партнерские отношения с лучшими отелями и ресторанами</li>
                  <li>Опытные гиды-экскурсоводы</li>
                  <li>Индивидуальный подход к каждому клиенту</li>
                  <li>Круглосуточная поддержка во время путешествий</li>
                  <li>Конкурентные цены и гибкая система скидок</li>
                </ul>
              </div>

              <div className="info-stats">
                <div className="stat-card">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">Довольных туристов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Туристических маршрутов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Стран назначения</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">10</div>
                  <div className="stat-label">Лет на рынке</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="belarus-focus">
          <div className="container">
            <h2>Туризм по Беларуси</h2>
            <div className="belarus-content">
              <div className="belarus-text">
                <p>
                  Беларусь - это страна с богатой историей, уникальной природой
                  и гостеприимными людьми. Мы специализируемся на организации
                  туров по самым интересным местам нашей родины:
                </p>
                <ul className="belarus-destinations">
                  <li>
                    <strong>Беловежская пуща</strong> - последний европейский
                    первобытный лес
                  </li>
                  <li>
                    <strong>Браславские озера</strong> - жемчужина белорусского
                    Поозерья
                  </li>
                  <li>
                    <strong>Мирский и Несвижский замки</strong> - объекты
                    Всемирного наследия ЮНЕСКО
                  </li>
                  <li>
                    <strong>Минск</strong> - современная столица с богатой
                    историей
                  </li>
                  <li>
                    <strong>Гродно и Брест</strong> - города с многовековой
                    историей
                  </li>
                  <li>
                    <strong>Агроусадьбы</strong> - знакомство с традиционным
                    бытом
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mission-vision">
          <div className="container">
            <div className="mv-grid">
              <div className="mission">
                <h2>Наша миссия</h2>
                <p>
                  Показать красоту и уникальность Беларуси, сделать путешествия
                  доступными для каждого и создать незабываемые впечатления,
                  которые останутся на всю жизнь.
                </p>
              </div>
              <div className="vision">
                <h2>Наше видение</h2>
                <p>
                  Стать ведущей туристической компанией Беларуси, которая
                  объединяет людей через путешествия и способствует развитию
                  внутреннего туризма в стране.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="team">
          <div className="container">
            <h2>Наша команда</h2>
            <p className="team-description">
              Наша команда состоит из профессиональных туроператоров, опытных
              гидов и специалистов по сервису, которые любят свое дело и готовы
              сделать ваше путешествие незабываемым.
            </p>
            <div className="team-stats">
              <div className="team-stat">
                <span className="number">15</span>
                <span className="label">Сотрудников</span>
              </div>
              <div className="team-stat">
                <span className="number">8</span>
                <span className="label">Опытных гидов</span>
              </div>
              <div className="team-stat">
                <span className="number">3</span>
                <span className="label">Офиса в Беларуси</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
