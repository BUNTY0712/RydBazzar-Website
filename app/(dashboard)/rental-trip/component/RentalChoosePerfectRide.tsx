'use client';

import React, { useState } from 'react';
import { Star, Clock, Gauge, Luggage, Wallet, ShieldCheck, Loader2 } from 'lucide-react';
import WagonR from "../../../src/assets/Image/WagonR.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateRentalBookingMutation } from "@/app/store/api/rentalApi";

interface ChoosePerfectRideProps {
  data: any;
}

const RentalChoosePerfectRide = ({ data }: ChoosePerfectRideProps) => {
  const router = useRouter();
  const [selectedFuel, setSelectedFuel] = useState<Record<string, string>>({});
  const [loadingCarId, setLoadingCarId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // RTK Query Mutation Hook
  const [createRentalBooking] = useCreateRentalBookingMutation();

  const vehicleList = data?.vehicleTypePrices || [];

  const handleBooking = async (car: any) => {
    setErrorMessage(null);
    setLoadingCarId(car.vehicleTypeId);

    try {
      // 1. Retrieve stored user info from localStorage
      let user = null;
      const storedUser = localStorage.getItem("RydBazzarUser");
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      }

      // 2. Retrieve initial form payload saved during search from sessionStorage
      let rentalTripDetails = data;
      const storedPayload = sessionStorage.getItem("rentalBookingPayload");
      if (storedPayload) {
        try {
          rentalTripDetails = { ...data, ...JSON.parse(storedPayload) };
        } catch (e) {
          console.error("Error parsing rentalBookingPayload", e);
        }
      }

      // 3. Construct your exact required payload
      const payload = {
        phoneNumber: user?.mobile || user?.phoneNumber || "9901030543",
        role: user?.role || 'CUSTOMER',
        tripType: 'RENTAL',
        fromLocation: rentalTripDetails?.fromLocation || "Unknown Location",
        fromLatitude: rentalTripDetails?.fromLatitude || 13.0475,
        fromLongitude: rentalTripDetails?.fromLongitude || 80.2825,
        pickupDate: rentalTripDetails?.pickupDate || "2026-07-20",
        pickupTime: rentalTripDetails?.pickupTime || "10:30",
        amOrPm: rentalTripDetails?.amOrPm || "AM",
        vehicleTypeId: car?.vehicleTypeId || vehicleList?.[0]?.vehicleTypeId,
        vehicleTypeName: car?.vehicleTypeName || vehicleList?.[0]?.vehicleTypeName,
        durationHours: rentalTripDetails?.durationHours || 2,
        durationMinutes: (rentalTripDetails?.durationHours || 2) * 60,
        intermediateStops: rentalTripDetails?.intermediateStops || [],
      };

      // 4. Call the createRentalBooking mutation API
      const response = await createRentalBooking(payload).unwrap();

      // 5. Store response & selected vehicle state before navigating
      sessionStorage.setItem("selectedRentalVehicle", JSON.stringify(car));
      sessionStorage.setItem("rentalBookingResponse", JSON.stringify(response));

      // Navigate to confirmation page
      router.push("/alltrips");
    } catch (error: any) {
      console.error("Failed to create rental booking:", error);
      setErrorMessage(
        error?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoadingCarId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans text-slate-800 relative">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 text-center">
          Select Your <span className="text-[#fbc843]">Rental Cab</span>
        </h2>
        <div className="h-[1px] w-16 md:w-32 bg-slate-200"></div>
      </div>

      {/* Global Error Banner if API fails */}
      {errorMessage && (
        <div className="mb-6 p-4 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl text-center">
          {errorMessage}
        </div>
      )}

      {/* Ride Options Render List */}
      <div className="space-y-6">
        {vehicleList.map((car: any) => {
          const currentFuel = selectedFuel[car.vehicleTypeId] || 'Diesel';
          const isBookingThisCar = loadingCarId === car.vehicleTypeId;

          return (
            <div 
              key={car.vehicleTypeId} 
              className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden relative flex flex-col justify-between group"
            >
              <div className="absolute top-4 left-4 bg-[#fbc843] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm text-slate-900">
                <Star className="w-3 h-3 fill-slate-900 stroke-slate-900" />
                Popular Choice
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Vehicle Image */}
                <div className="md:col-span-4 flex justify-center pt-4 md:pt-0">
                  <Image 
                    src={WagonR} 
                    alt={car.vehicleTypeName} 
                    className="max-h-32 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Vehicle Info */}
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
                    AC Cab | Comfortable City Ride
                  </p>

                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>Hourly Rate: <span className="text-slate-900">₹{car.hourlyRate}/hr</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>
                        Extra distance: <span className="text-slate-900">₹{car.priceExtraPerKm}/km</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600 stroke-[2.5]" />
                      <span className="text-green-700 font-extrabold">
                        Advance Pay: ₹{car.advanceAmount} | Remaining Balance: ₹{car.balance}
                      </span>
                    </div>
                  </div>

                  {/* Fuel Radio Selector */}
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

                {/* Price Display & Selection */}
                <div className="md:col-span-3 flex flex-col md:items-end justify-center text-left md:text-right border-t border-dashed border-slate-100 pt-4 md:pt-0 md:border-t-0">
                  <div className="text-xs font-bold text-amber-600 mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Fixed Package Price</span>
                  </div>

                  <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    ₹{car.totalAmount}
                  </div>
                  
                  <p className="text-[11px] font-semibold text-slate-400 mt-1 mb-4">
                    Advance: <strong className="text-slate-700">₹{car.advanceAmount}</strong> (20%)
                  </p>

                  <button 
                    onClick={() => handleBooking(car)} 
                    disabled={isBookingThisCar}
                    className="w-full md:w-[90%] bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-md shadow-amber-100 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isBookingThisCar && <Loader2 size={18} className="animate-spin" />}
                    {isBookingThisCar ? "Booking..." : "Select Cab"}
                  </button>
                </div>
              </div>

              {/* Message Banner Footer */}
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

export default RentalChoosePerfectRide;