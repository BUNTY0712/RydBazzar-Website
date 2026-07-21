'use client';

import React, { useEffect, useState } from 'react';
import { Star, User, Route, Luggage, Check, Loader2 } from 'lucide-react';
import WagonR from "../../../src/assets/Image/WagonR.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  useGetBestPriceWithoutTollMutation, 
  useGetBestPriceWithTollMutation 
} from "@/app/store/api/homeApi";

interface ChoosePerfectRideProps {
  data: any;
}

const ChoosePerfectRide = ({ data: initialData }: ChoosePerfectRideProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Best Price');
  const [currentTripData, setCurrentTripData] = useState<any>(initialData);
  const [selectedFuel, setSelectedFuel] = useState<Record<string, string>>({});

  // RTK Mutation triggers
  const [getWithoutToll, { isLoading: loadingWithoutToll }] = useGetBestPriceWithoutTollMutation();
  const [getWithToll, { isLoading: loadingWithToll }] = useGetBestPriceWithTollMutation();

  const isLoading = loadingWithoutToll || loadingWithToll;
  const vehicleList = currentTripData?.vehicleTypePrices || [];

useEffect(() => {
  const RydBazzarUser = JSON.parse(
    localStorage.getItem("RydBazzarUser") || "{}"
  );

  console.log("RydBazzarUser:", RydBazzarUser);
}, []);

  // Re-fetch data depending on clicked filter context
  const handleTabChange = async (tabName: string) => {
    setActiveTab(tabName);

    // Build the request matching your payload schema requirements
    const payload = {
      phoneNumber: currentTripData?.phoneNumber || "9901030543",
      role: "CUSTOMER" as const,
      fromLocation: currentTripData?.fromLocation || "",
      fromLatitude: currentTripData?.fromLatitude || 0,
      fromLongitude: currentTripData?.fromLongitude || 0,
      toLocation: currentTripData?.toLocation || "",
      toLatitude: currentTripData?.toLatitude || 0,
      toLongitude: currentTripData?.toLongitude || 0,
      pickupDate: currentTripData?.pickupDate || "",
      pickupTime: currentTripData?.pickupTime || "",
      amOrPm: (currentTripData?.amOrPm as "AM" | "PM") || "AM",
      returnDate: "string",
      returnTime: "6:00",
      returnAmOrPm: "PM" as const,
      intermediateStops: currentTripData?.intermediateStops || [],
      tripType: "ONE_WAY" as const
    };

    try {
      let freshData;
      if (tabName === "Best Price") {
        freshData = await getWithoutToll(payload).unwrap();
      } else {
        // 'Troll State Tax' and 'Inclusive Price' hit the matching Toll endpoints
        freshData = await getWithToll(payload).unwrap();
      }
      
      setCurrentTripData(freshData);
      sessionStorage.setItem("currentTripQuote", JSON.stringify(freshData));
      // console.log("currentTripQuote",currentTripQuote);
    } catch (err) {
      console.error("Failed fetching live tab configuration quote:", err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 font-sans text-slate-800 relative">
      
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 text-center">
          Choose your <span className="text-[#fbc843]">perfect ride</span>
        </h2>
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
      </div>

      {/* Tabs Layout Container */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100/80 p-1.5 rounded-full flex gap-1 shadow-sm border border-slate-200/40 relative">
          {['Best Price', 'Troll State Tax', 'Inclusive Price'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#fbc843] text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 disabled:opacity-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Overlay State view block wrapper */}
      {isLoading && (
        <div className="absolute inset-x-0 top-40 flex justify-center z-50 bg-white/60 min-h-[300px] items-center">
          <Loader2 className="animate-spin text-[#fbc843]" size={36} />
        </div>
      )}

      {/* Ride Options Render List */}
      <div className={`space-y-6 ${isLoading ? 'opacity-30 pointer-events-none' : ''}`}>
        {vehicleList.map((car: any) => {
          const currentFuel = selectedFuel[car.vehicleTypeId] || 'Diesel';
          
          // Safety logic selection configuration reference for inner pricing blocks
          const pricingDetails = car.bestPriceWithoutToll || car.bestPriceWithToll || {};

          return (
            <div 
              key={car.vehicleTypeId} 
              className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden relative flex flex-col justify-between group"
            >
              <div className="absolute top-4 left-4 bg-[#fbc843] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm text-slate-900">
                <Star className="w-3 h-3 fill-slate-900 stroke-slate-900" />
                Popular
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Car Asset Representation */}
                <div className="md:col-span-4 flex justify-center pt-4 md:pt-0">
                  <Image 
                    src={WagonR} 
                    alt={car.vehicleTypeName} 
                    className="max-h-32 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Car Info Configuration Data Fields */}
                <div className="md:col-span-5 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {car.vehicleTypeName}
                    </h3>
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      4.8 <Star className="w-2.5 h-2.5 fill-white stroke-white" />
                    </span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    or equivalent | AC Cab
                  </p>

                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>Driver allowance included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>
                        {car.distanceKm} kms included | Rate: <span className="text-slate-900">₹{car.costPerKm}/km</span>
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Fuel Options Setup Selector layout */}
                  <div className="flex items-center gap-4 pt-1">
                    {['CNG', 'Diesel'].map((fuel) => (
                      <label key={fuel} className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="radio"
                          name={`fuel-${car.vehicleTypeId}`}
                          checked={currentFuel === fuel}
                          onChange={() => setSelectedFuel({ ...selectedFuel, [car.vehicleTypeId]: fuel })}
                          className="sr-only"
                        />
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentFuel === fuel ? 'border-[#fbc843]' : 'border-slate-300'
                        }`}>
                          {currentFuel === fuel && <span className="w-1.5 h-1.5 rounded-full bg-[#fbc843]" />}
                        </span>
                        <span>{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pricing Calculation Display Block */}
                <div className="md:col-span-3 flex flex-col md:items-end justify-center text-left md:text-right border-t border-dashed border-slate-100 pt-4 md:pt-0 md:border-t-0">
                  {pricingDetails?.discountPercent > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 mb-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{pricingDetails.discountPercent}% OFF</span>
                    </div>
                  )}

                  <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    ₹{car.totalAmount}
                  </div>
                  
                  <p className="text-[11px] font-semibold text-slate-400 mt-1 mb-4">
                    + ₹{pricingDetails?.gstAmount || 0} GST & Toll Charges Included
                  </p>


<button 
  onClick={() => {
    // Cache the active vehicle block alongside parent structure metrics 
    sessionStorage.setItem("selectedVehicleOption", JSON.stringify(car));
    sessionStorage.setItem("bookingContextData", JSON.stringify(currentTripData));
    router.push("/payment");
  }} 
  className="w-full md:w-[85%] bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-md shadow-amber-100"
>
  Select Car
</button>
                </div>
              </div>

              {/* API Info Notice Bar Footer Text Message info */}
              <div className="bg-amber-50/50 border-t border-amber-100/40 py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Luggage className="w-4 h-4 text-slate-700 stroke-[2]" />
                  <span className="text-xs font-bold text-amber-900">
                    {car.message}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChoosePerfectRide;