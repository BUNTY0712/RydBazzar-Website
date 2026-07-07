import React from 'react'
import BgImage from "../../../src/assets/Image/bgImage.png"
import { Calendar, Clock, ChevronDown, ShieldCheck, CreditCard, Car } from 'lucide-react'
const Banner = () => {
  return (
    <div>
        <div 
      className="min-h-[calc(100vh-80px)] w-full flex items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${BgImage.src})` }} // Fix: Binds image directly to container layer
    >
      {/* Soft gradient overlay to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent pointer-events-none" />

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Hero Marketing Content */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#1a2333]">
            Cab Booking Made Easy
          </span>
          
          <p className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2333] leading-tight font-bold">
            Safe. Reliable.<br />
            Always <span className="text-[#fbc843]">On Time.</span>
          </p>

          <p className="text-gray-700 max-w-xl text-sm md:text-base leading-relaxed font-medium">
            Book affordable cab rides anytime, anywhere. Professional drivers, clean cars, 
            transparent pricing, and smooth travel experiences for city rides, airport transfers, 
            and outstation trips.
          </p>

          <div>
            <button className="bg-[#fbc843] hover:bg-[#e0b236] text-[#1a2333] font-bold px-8 py-3.5 rounded shadow-lg transition-all text-sm">
              Book Now
            </button>
          </div>

          {/* Core Feature Highlights */}
          <div className="pt-8 flex flex-wrap gap-6 items-center text-[#1a2333] font-bold text-sm">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#fbc843]" />
              <span>24/7 Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#fbc843]" />
              <span>Verified Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#fbc843]" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Booking Card Form */}
        <div className="lg:col-span-5 w-full flex justify-end">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Choose Your Journey</h2>
            
            {/* Form Tabs */}
            <div className="flex border-b border-gray-100 text-xs font-bold text-gray-400 mb-5 pb-1 gap-4">
              <button className="text-[#fbc843] border-b-2 border-[#fbc843] pb-2 px-1">One Way</button>
              <button className="hover:text-gray-600 pb-2 px-1 transition-colors">Round Trip</button>
              <button className="hover:text-gray-600 pb-2 px-1 transition-colors">Airport</button>
              <button className="hover:text-gray-600 pb-2 px-1 transition-colors">Rental</button>
            </div>

            {/* Booking Form Fields */}
            <div className="space-y-4">
              {/* Pickup field */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Pickup Location</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 w-2 h-2 rounded-full bg-green-500" />
                  <input 
                    type="text" 
                    placeholder="Enter pickup location" 
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 text-gray-800"
                  />
                </div>
              </div>

              {/* Drop field */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Drop Location</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 w-2 h-2 rounded-full bg-red-500" />
                  <input 
                    type="text" 
                    placeholder="Enter drop location" 
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 text-gray-800"
                  />
                </div>
              </div>

              {/* Date & Time fields split row */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Date & Time</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="dd/mm/yy" 
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 text-gray-800"
                    />
                    <Calendar className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="--:-- --" 
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 text-gray-800"
                    />
                    <Clock className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Vehicle Select dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Vehicle Type</label>
                <div className="relative flex items-center">
                  <select 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Select vehicle type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Submit CTA button */}
              <div className="pt-2">
                <button className="w-full bg-[#fbc843] hover:bg-[#e0b236] text-[#1a2333] font-bold py-3 rounded-lg text-sm transition-colors shadow-md">
                  Find My cab
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}

export default Banner
