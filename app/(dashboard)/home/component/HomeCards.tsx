import React from 'react'
import { Car, ShieldCheck, UserCheck, Headphones } from 'lucide-react'

const cardData = [
  {
    id: 1,
    icon: Car,
    title: "Wide Range of Cabs",
    description: "Choose from hatchbacks, sedans, SUVs, and premium cars for every travel need."
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Transparent Pricing",
    description: "No hidden charges. What you see is exactly what you pay."
  },
  {
    id: 3,
    icon: UserCheck,
    title: "Verified Drivers",
    description: "Experienced and background-verified drivers for a safe journey."
  },
  {
    id: 4,
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Dedicated support team available anytime for assistance."
  }
]

const HomeCards = () => {
  return (
    <div className="w-full bg-[#fff] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card) => {
          const IconComponent = card.icon
          return (
            <div 
              key={card.id} 
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-50/50 group"
            >

              <div className="w-16 h-16 rounded-full bg-[#fbfbff] flex items-center justify-center mb-6 shadow-inner transition-transform duration-300 group-hover:scale-105">
                <IconComponent className="w-7 h-7 text-[#fbc843]" strokeWidth={2} />
              </div>


              <h3 className="text-[#1a2333] font-extrabold text-base mb-3 tracking-wide">
                {card.title}
              </h3>


              <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-[240px]">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeCards