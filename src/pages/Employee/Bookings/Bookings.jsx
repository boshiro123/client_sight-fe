import React from "react"
import { Helmet } from "react-helmet"
import Header from "../../../common-ui/Header"
import Footer from "../../../common-ui/Footer"
import ApplicationsList from "./ApplicationsList"
import "./Bookings.css"

const Bookings = () => {
  return (
    <div className="bookings-page">
      <Helmet>
        <title>Бронирования | Панель сотрудника</title>
      </Helmet>

      <Header />

      <main className="bookings-main">
        <div className="bookings-container">
          <ApplicationsList />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Bookings
