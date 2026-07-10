import React from 'react'
import Image from 'next/image'
import { Car, ArrowRight, Users, Plane } from 'lucide-react'

// Replace these placeholder paths with your actual imported assets if needed
// e.g., import CityImg from "@/assets/Image/city-ride.png"
const rideOptions = [
  {
    id: 1,
    title: "City Rides",
    description: "Affordable daily rides for office, shopping, and local travel.",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Oneway Drops",
    description: "Comfortable long-distance rides for weekend and business trips.",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Local Rentals",
    description: "Book cabs on hourly packages for flexible travel plans.",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Airport Transfer",
    description: "On-time airport pickup and drop with flight tracking support.",
    icon: Plane,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  }
];

const PopularRideOptions = () => {
  return (
    <section className="w-full bg-white py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        

        <div className="text-center flex flex-col items-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#fbc843] mb-3">
            Services
          </span>
          <p className="text-3xl md:text-4xl font-black text-[#1a2333] mb-4 font-bold">
            Popular Ride Options
          </p>

          <div className="w-12 h-1 bg-[#fbc843] rounded mb-6" />
          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-medium">
            Purus porta feugiat egestas a diam sed ipsum, enim orci. In lectus bibendum 
            gravida aliquet faucibus id. Id gravida consectetur lectus imperdiet.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rideOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <div 
                key={option.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col group"
              >

                <div className="relative h-48 w-full bg-gray-900 overflow-hidden">

                  <div className="absolute inset-0 bg-[#1a2333]/10 z-10" />
                  <Image 
                    src={option.image} 
                    alt={option.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>


                <div className="relative px-6">
                  <div className="absolute -top-7 left-6 w-14 h-14 rounded-full bg-[#fbc843] flex items-center justify-center shadow-md z-20 border-4 border-white">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>


                <div className="p-6 pt-10 flex flex-col flex-1">
                  <h3 className="text-[#1a2333] font-extrabold text-lg mb-2 tracking-wide">
                    {option.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium mb-6 flex-1">
                    {option.description}
                  </p>


                  <div className="mt-auto">
                    <a 
                      href="#book" 
                      className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#fbc843] hover:text-[#e0b236] transition-colors"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </a>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default PopularRideOptions