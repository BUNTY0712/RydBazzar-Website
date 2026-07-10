import React from 'react'
import Image from 'next/image'
import YellowBg from "../../../src/assets/Image/yellowBg.png"
import { Star } from 'lucide-react'

const feedbackData = [
  {
    id: 1,
    name: "Raj Barman",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    quote:
      "“Purus porta feugiat egestas a diam sed ipsum enim orciln lectus biben gravida aliquet faucibus consec tetur lectus imperdiet empor.”",
  },
  {
    id: 2,
    name: "Rocky Singh",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    quote:
      "“Purus porta feugiat egestas a diam sed ipsum enim orciln lectus biben gravida aliquet faucibus consec tetur lectus imperdiet empor.”",
  },
];

const Testimonials = () => {
  return (
    <section 
      className="w-full py-20 px-6 bg-cover bg-center bg-no-repeat relative overflow-visible"
      style={{ backgroundImage: `url(${YellowBg.src})` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        

        <div className="lg:col-span-4 flex flex-col space-y-5">
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#1a2333]/80">
            Testimonials
          </span>
          
          <div className="space-y-3">
            <p className="text-4xl md:text-5xl font-black text-[#1a2333] leading-tight font-bold">
              What our<br />customers are<br />saying
            </p>
            <div className="w-12 h-0.5 bg-[#1a2333]" />
          </div>

          <p className="text-[#1a2333]/80 text-sm leading-relaxed font-medium max-w-sm">
            Purus porta feugiat egestas a diam sed ipsum, enim orci. In lectus bibendum 
            gravida aliquet faucibus id. Id gravida consectetur lectus imperdiet.
          </p>

          <div className="pt-2">
            <button className="border border-white text-white font-bold px-8 py-3 rounded transition-all hover:bg-white hover:text-[#1a2333] text-sm">
              View All
            </button>
          </div>
        </div>


        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 pt-12 lg:pt-0">
          {feedbackData.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl px-6 pb-8 pt-16 flex flex-col items-center text-center shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative"
            >

              <div className="absolute -top-12 w-24 h-24 rounded-full bg-white p-1.5 shadow-lg">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                  <Image 
                    src={item.avatar} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>


              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbc843] text-[#fbc843]" />
                ))}
              </div>


              <p className="text-gray-400 text-sm leading-relaxed font-medium mb-6 px-2 flex-1">
                {item.quote}
              </p>


              <div className="mt-auto">
                <h4 className="text-[#1a2333] font-black text-base tracking-wide capitalize">
                  {item.name}
                </h4>
                <span className="text-[#1d4ed8] text-xs font-bold tracking-wider block mt-0.5">
                  {item.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials