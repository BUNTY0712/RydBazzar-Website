import React from 'react'
import Image from 'next/image'

// If your image is stored locally, change this to your actual import path
// import AboutImg from "@/assets/Image/about-car.png"

const AboutRydBazzar = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content Column */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#1d4ed8]">
            About Us
          </span>
          
          <p className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2333] leading-[1.15] font-bold">
            About RydBazzar Ride<br />Company
          </p>

          {/* Accent Line Indicator */}
          <div className="w-12 h-1 bg-[#1d4ed8] rounded" />

          {/* Body Paragraphs */}
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-medium max-w-xl">
            <p>
              Purus porta feugiat egestas a diam sed ipsum, enim. In lectus bibendum 
              gravida aliquet faucibus id gravida consectetur lectus imperdiet vulputate 
              scelerisque. Tempor in aenean neque posuere. Vitae eleifend id tellus
            </p>
            <p>
              Purus porta feugiat egestas a diam sed ipsum, enim. In lectus bibendum 
              gravida aliquet faucibus id gravida consectetur lectus imperdiet vulputate 
              scelerisque. Tempor in aenean neque posuere. Vitae eleifend id tellus
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button className="bg-[#fbc843] hover:bg-[#e0b236] text-[#1a2333] font-bold px-8 py-3.5 rounded transition-all text-sm shadow-md">
              Learn More
            </button>
          </div>

        </div>

        {/* Right Side Angled Image Column */}
        <div className="lg:col-span-6 w-full h-[350px] md:h-[480px] relative">
          <div className="w-full h-full clip-path-about relative bg-gray-900 overflow-hidden">
            <Image
  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  alt="Luxury ride parked beside a city storefront"
  fill
  priority
  className="object-cover object-center"
/>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutRydBazzar