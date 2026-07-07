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
  
  // Initialize AOS on the client side when component mounts
  useEffect(() => {
    AOS.init({
      duration: 600,     // Animation duration in milliseconds
      easing: 'ease-out', // Default easing function
      once: true,        // True means animation only triggers once when scrolling down
      offset: 100,       // Change trigger point (in px) from the original top offset
    })
  }, [])

  return (
    <>
      {/* Banner shows immediately */}
      <div>
        <Banner />
      </div>

      {/* AOS scroll-driven animated wrappers */}
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