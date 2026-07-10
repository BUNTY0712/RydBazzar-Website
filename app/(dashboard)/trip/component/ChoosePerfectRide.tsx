'use client';
import React, { useState } from 'react';
import { Star, User, Route, Luggage, Plus, Check } from 'lucide-react';
import WagonR from "../../../src/assets/Image/WagonR.png";
import Image from "next/image";
import { useRouter } from "next/navigation";


const rideOptions = [
  {
    id: 1,
    name: 'Wagon R',
    rating: '4.6',
    type: 'or equivalent | 4 Seater AC Cab',
    driverAllowance: 'Driver allowance included',
    kmsIncluded: '1020 kms included | Post limit:',
    ratePerKm: '₹15/km',
    originalPrice: '24,481',
    discountedPrice: '23,606',
    taxes: '1,693',
    fuelOptions: ['CNG', 'Diesel'],
    image: WagonR,
    isPopular: true,
  },
  {
    id: 2,
    name: 'Toyota Etios',
    rating: '4.7',
    type: 'or equivalent | 4 Seater AC Sedan',
    driverAllowance: 'Driver allowance included',
    kmsIncluded: '1020 kms included | Post limit:',
    ratePerKm: '₹16/km',
    originalPrice: '25,100',
    discountedPrice: '24,250',
    taxes: '1,750',
    fuelOptions: ['Petrol', 'Diesel'],
    image: WagonR,
    isPopular: true,
  },
  {
    id: 3,
    name: 'Swift Dzire',
    rating: '4.8',
    type: 'or equivalent | 4 Seater Sedan',
    driverAllowance: 'Driver allowance included',
    kmsIncluded: '1020 kms included | Post limit:',
    ratePerKm: '₹16/km',
    originalPrice: '25,800',
    discountedPrice: '24,950',
    taxes: '1,820',
    fuelOptions: ['Petrol', 'CNG'],
    image: WagonR,
    isPopular: true,
  },
 
 
 
];

const ChoosePerfectRide = () => {
     const router = useRouter();
  const [activeTab, setActiveTab] = useState('Troll State Tax');
const [selectedFuel, setSelectedFuel] = useState<Record<number, string>>({
  1: 'CNG',
  2: 'CNG'
});

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 font-sans text-slate-800">

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 text-center">
          Choose your <span className="text-[#fbc843]">perfect ride</span>
        </h2>
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
      </div>


      <div className="flex justify-center mb-10">
        <div className="bg-slate-100/80 p-1.5 rounded-full flex gap-1 shadow-sm border border-slate-200/40">
          {['Best Price', 'Troll State Tax', 'Inclusive Price'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#fbc843] text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>


      <div className="space-y-6">
        {rideOptions.map((car) => (
          <div 
            key={car.id} 
            className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden relative flex flex-col justify-between group"
          >

            {car.isPopular && (
              <div className="absolute top-4 left-4 bg-[#fbc843] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm text-slate-900">
                <Star className="w-3 h-3 fill-slate-900 stroke-slate-900" />
                Popular
              </div>
            )}


            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              

              <div className="md:col-span-4 flex justify-center pt-4 md:pt-0">
                <Image 
                  src={car.image} 
                  alt={car.name} 
                  className="max-h-40 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>


              <div className="md:col-span-5 space-y-3.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{car.name}</h3>
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {car.rating} <Star className="w-2.5 h-2.5 fill-white stroke-white" />
                  </span>
                </div>
                
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {car.type}
                </p>


                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                    <span>{car.driverAllowance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                    <span>
                      {car.kmsIncluded} <span className="text-slate-900">{car.ratePerKm}</span>
                    </span>
                  </div>
                </div>


                <div className="flex items-center gap-4 pt-1">
                  {car.fuelOptions.map((fuel) => (
                    <label key={fuel} className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="radio"
                        name={`fuel-${car.id}`}
                        checked={selectedFuel[car.id] === fuel}
                        onChange={() => setSelectedFuel({ ...selectedFuel, [car.id]: fuel })}
                        className="sr-only"
                      />
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedFuel[car.id] === fuel ? 'border-[#fbc843]' : 'border-slate-300'
                      }`}>
                        {selectedFuel[car.id] === fuel && <span className="w-1.5 h-1.5 rounded-full bg-[#fbc843]" />}
                      </span>
                      <span>{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>


              <div className="md:col-span-3 flex flex-col md:items-end justify-center text-left md:text-right border-t border-dashed border-slate-100 pt-4 md:pt-0 md:border-t-0">

                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 mb-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>4% OFF</span>
                  <span className="text-slate-400 line-through font-medium">₹{car.originalPrice}</span>
                </div>


                <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  ₹{car.discountedPrice}
                </div>
                

                <p className="text-[11px] font-semibold text-slate-400 mt-1 mb-4">
                  + ₹{car.taxes} Taxes & Charges
                </p>


                <button onClick={() => router.push("/payment")} className="w-[80%] bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-bold text-sm py-3 px-6 rounded-xl transition-all duration-200 shadow-md shadow-amber-100">
                  Select Car
                </button>
              </div>

            </div>


            <div className="bg-amber-50/50 border-t border-amber-100/40 py-3 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Luggage className="w-4 h-4 text-slate-700 stroke-[2]" />
                <span className="text-xs font-extrabold text-slate-700">
                  Add Luggage Carrier <span className="text-slate-400 font-bold ml-1">₹149</span>
                </span>
              </div>
              <button className="w-6 h-6 bg-slate-950 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow transition-colors duration-200">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePerfectRide;