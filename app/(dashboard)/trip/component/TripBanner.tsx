import React from 'react';
import { Sun, RotateCcw, PhoneCall, Pencil, ArrowRight } from 'lucide-react';
// Import the image directly
import TripBannerBg from "../../../src/assets/Image/TripBanner.png";

const TripBanner = () => {
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
          <h2 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight flex items-center gap-2">
            Mumbai <ArrowRight className="w-5 h-5 text-slate-300 stroke-[2.5]" /> Bangalore
          </h2>
        </div>


        <div className="w-full h-[1px] bg-slate-700/50 my-6 max-w-xl"></div>


        <div className="flex flex-wrap items-center gap-10 max-w-3xl">

          <div className="flex gap-8 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Trip Type</p>
              <p className="text-base font-bold mt-1">One way</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pickup Date</p>
              <p className="text-base font-bold mt-1">22 Jun 2026</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pickup Time</p>
              <p className="text-base font-bold mt-1">07:00 AM</p>
            </div>
          </div>


          <button className="flex items-center gap-2 border border-slate-600 bg-slate-800/40 hover:bg-slate-800/80 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200">
            Modify Booking
            <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>


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