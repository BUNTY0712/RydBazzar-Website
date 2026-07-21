"use client";

import React from 'react';
import { Sun, RotateCcw, PhoneCall, Pencil, ArrowRight, MapPin } from 'lucide-react';
import TripBannerBg from "../../../src/assets/Image/TripBanner.png";
import { useRouter } from "next/navigation";

interface IntermediateStop {
  order: number;
  location: string;
  latitude: number;
  longitude: number;
  state: string;
}

interface TripBannerProps {
  data: {
    fromLocation?: string;
    toLocation?: string;
    distanceKm?: number;
    durationMinutes?: number;
    tripType?: string;
    pickupDate?: string;
    pickupTime?: string;
    amOrPm?: string;
    intermediateStops?: IntermediateStop[];
    [key: string]: any;
  };
}

const TripBanner = ({ data }: TripBannerProps) => {
  const router = useRouter();
  const handleModifyBooking = () => {
  if (data) {
    // Save state to pre-fill the form upon redirecting back
    sessionStorage.setItem("modifyTripData", JSON.stringify(data));
  }
  router.back(); // or router.push("/") depending on your routing setup
};

  // Format Trip type clean naming format
  const formattedTripType = data?.tripType === "ONE_WAY" ? "One Way" : data?.tripType || "One Way";
  const intermediateStops = data?.intermediateStops || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 font-sans selection:bg-yellow-400">
      <div 
        className="relative w-full rounded-[24px] bg-cover bg-right bg-no-repeat p-8 md:p-12 text-white overflow-hidden min-h-[320px] flex flex-col justify-between"
        style={{ backgroundImage: `url(${TripBannerBg.src})` }}
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-yellow-500 font-bold">
            Your Trip Summary
          </span>

          {/* Route Header with Pickup, Intermediate Stops & Drop */}
          <h2 className="text-xl md:text-2xl font-bold mt-1 tracking-tight flex flex-wrap items-center gap-2">
            {/* Pickup Location */}
            <span className="truncate max-w-[200px] md:max-w-xs" title={data?.fromLocation}>
              {data?.fromLocation?.split(',')[0]}
            </span> 

            {/* Intermediate Stops Sequence */}
            {intermediateStops.map((stop) => (
              <React.Fragment key={stop.order || stop.location}>
                <ArrowRight className="w-5 h-5 text-yellow-500 shrink-0 stroke-[2.5]" />
                <span 
                  className="truncate max-w-[180px] md:max-w-xs text-yellow-300 bg-yellow-950/40 px-2.5 py-0.5 rounded-md border border-yellow-500/30 text-lg font-semibold"
                  title={stop.location}
                >
                  {stop.location?.split(',')[0]}
                </span>
              </React.Fragment>
            ))}

            {/* Drop Location */}
            <ArrowRight className="w-5 h-5 text-slate-300 shrink-0 stroke-[2.5]" /> 
            <span className="truncate max-w-[200px] md:max-w-xs" title={data?.toLocation}>
              {data?.toLocation?.split(',')[0]}
            </span>
          </h2>

          <p className="text-xs text-slate-400 mt-1 font-medium max-w-xl hidden md:block">
            {data?.distanceKm} km • Approx. {data?.durationMinutes} mins away
          </p>
        </div>

        <div className="w-full h-[1px] bg-slate-700/50 my-6 max-w-xl"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 max-w-3xl">
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Trip Type</p>
              <p className="text-base font-bold mt-1">{formattedTripType}</p>
            </div>

            {/* Intermediate Stops Badge Count */}
            {intermediateStops.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Via Stops</p>
                <p className="text-base font-bold mt-1 text-yellow-400 flex items-center gap-1">
                  <MapPin size={16} />
                  {intermediateStops.length} {intermediateStops.length === 1 ? 'Stop' : 'Stops'}
                </p>
              </div>
            )}

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
  onClick={handleModifyBooking} 
  className="flex items-center gap-2 border border-slate-600 bg-slate-800/40 hover:bg-slate-800/80 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200"
>
  Modify Booking
  <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
</button>
        </div>
      </div>

      {/* Info Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Zero Booking Fees</h4>
            <p className="text-xs text-slate-400 mt-0.5">Book now at zero cost</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Free Cancellation</h4>
            <p className="text-xs text-slate-400 mt-0.5">Upto 1 hour</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/40">
          <div className="w-11 h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-yellow-600 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">24×7 Support</h4>
            <p className="text-xs text-slate-400 mt-0.5">We are always here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripBanner;