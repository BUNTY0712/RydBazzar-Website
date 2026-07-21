'use client';

import React from 'react';
import { Sun, RotateCcw, PhoneCall, Pencil, MapPin, Clock } from 'lucide-react';
import TripBannerBg from "../../../src/assets/Image/TripBanner.png";
import { useRouter } from "next/navigation";

interface TripBannerProps {
  data: any;
}

const RentalTripBanner = ({ data }: TripBannerProps) => {
  const router = useRouter();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 font-sans selection:bg-yellow-400">
      <div 
        className="relative w-full rounded-[24px] bg-cover bg-right bg-no-repeat p-8 md:p-12 text-white overflow-hidden min-h-[320px] flex flex-col justify-between"
        style={{ backgroundImage: `url(${TripBannerBg.src})` }}
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-yellow-500 font-bold">
            Rental Trip Package
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-1 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
            <span className="truncate max-w-xl" title={data?.fromLocation}>
              {data?.fromLocation}
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Package Duration: <span className="text-yellow-400 font-bold">{data?.durationHours} Hours</span> ({data?.durationMinutes} Mins)
          </p>
        </div>

        <div className="w-full h-[1px] bg-slate-700/50 my-6 max-w-xl"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 max-w-3xl">
          <div className="flex gap-8 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Trip Type</p>
              <p className="text-base font-bold mt-1 text-yellow-400">{data?.tripType || "RENTAL"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pickup Date</p>
              <p className="text-base font-bold mt-1">{data?.pickupDate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pickup Time</p>
              <p className="text-base font-bold mt-1">{data?.pickupTime} {data?.amOrPm}</p>
            </div>
          </div>

          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 border border-slate-600 bg-slate-800/40 hover:bg-slate-800/80 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200"
          >
            Modify Booking
            <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Zero Booking Fees</h4>
            <p className="text-xs text-slate-400 mt-0.5">Book now at zero extra cost</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Flexible Hours</h4>
            <p className="text-xs text-slate-400 mt-0.5">Pay only extra for additional distance</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">24×7 Driver Support</h4>
            <p className="text-xs text-slate-400 mt-0.5">We are always here for you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalTripBanner;