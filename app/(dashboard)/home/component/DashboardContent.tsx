"use client"

import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css' // Import the required AOS global CSS styles

import Banner from './Banner'
import HomeCards from './HomeCards'
import PopularRideOptions from './PopularRideOptions'
import AboutRydBazzar from './AboutRydBazzar'
import Testimonials from './Testimonials'

const DashboardContent = () => {
  

  useEffect(() => {
    AOS.init({
      duration: 600,     
      easing: 'ease-out', 
      once: true,        
      offset: 100,       
    })
  }, [])

  return (
    <>

      <div>
        <Banner />
      </div>


      <div data-aos="fade-up">
        <HomeCards />
      </div>

      <div data-aos="fade-up">
        <PopularRideOptions />
      </div>

      <div data-aos="fade-up">
        <AboutRydBazzar />
      </div>

      <div data-aos="fade-up">
        <Testimonials />
      </div>
    </>
  )
}

export default DashboardContent