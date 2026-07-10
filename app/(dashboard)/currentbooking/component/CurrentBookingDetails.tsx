import React from 'react';
import { 
  Copy, 
  Calendar, 
  Star, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  PhoneCall, 
  Download, 
  XCircle, 
  Radio 
} from 'lucide-react';
import { useRouter } from "next/navigation";

const CurrentBookingDetails = () => {
  const otpDigits = ['5', '0', '4', '0', '0', '0'];
   const router = useRouter();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      

      <div className="mb-6">
        <p className="text-2xl font-black text-[#0c1e36] tracking-tight font-bold">Current Booking</p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">View your current, upcoming and completed rides.</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        

        <div className="lg:col-span-8 space-y-6">
          

          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-100/40 space-y-6">
            

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md uppercase">
                  One Way
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <span>Booking ID: <span className="text-slate-900 font-bold">RB24672890</span></span>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Assigned
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pick Time</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">2 Jul 2026</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">06:35 PM</p>
                </div>
              </div>


              <div className="flex items-start gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" 
                  alt="Rohit Sharma" 
                  className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100 border border-slate-100 shadow-sm"
                />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Driver</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <h4 className="text-sm font-black text-slate-900">Rohit Sharma</h4>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">Wagon R • WB 12 AB 1234</p>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Payment Status</p>
                  <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[9px] px-2 py-0.5 rounded mt-1">
                    PAID
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Payment Method</p>
                  <p className="text-xs font-black text-slate-900 mt-1">Wallet</p>
                </div>
              </div>
            </div>


            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 md:p-5 space-y-5">

              <div className="flex gap-4 relative items-start">
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-emerald-500 shrink-0 mt-0.5 z-10" />
                <div className="absolute top-4 left-[7px] w-[2px] h-14 border-l-2 border-dashed border-slate-300 z-0" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">From</p>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Dum Dum Junction Railway Station</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">West Bengal</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                    <span>16.7 km</span>
                  </div>
                </div>
              </div>


              <div className="flex gap-4 items-start pt-1">
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-red-500 shrink-0 mt-0.5 z-10" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">To</p>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">Barasat Station Road</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">West Bengal</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>47 min</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-blue-50/30 border border-blue-100/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-6">
                <div>
                  <span className="text-xs font-bold text-slate-400">Base Fare</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">₹234.00</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">GST</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">₹11.69</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Total Fare</span>
                <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">₹245.49</p>
              </div>
            </div>

          </div>


          <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-100/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Share OTP with driver</h4>
                <p className="text-xs font-bold text-slate-400 mt-0.5">for a safe and secure trip</p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 text-center md:text-right">Start Trip OTP</p>
              <div className="flex gap-1.5 justify-center">
                {otpDigits.map((digit, idx) => (
                  <div 
                    key={idx} 
                    className="w-10 h-11 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center text-sm font-black text-slate-800"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 stroke-[2.5]" /> Expires in 04:45
              </p>
            </div>
          </div>
        </div>


        <div className="lg:col-span-4 space-y-6">
          

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Copy className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Price Details</h3>
            </div>
            
            <div className="space-y-3 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span className="text-slate-900 font-bold">₹234.00</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span>GST</span>
                <span className="text-slate-900 font-bold">₹11.69</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-slate-900">Total Fare</span>
                <span className="text-lg font-black text-slate-900 tracking-tight">₹245.49</span>
              </div>
            </div>
          </div>


          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Navigation className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Trip Status</h3>
            </div>


            <div className="space-y-5 relative pl-6 pt-1">

              <div className="absolute top-3 left-2 w-[2px] h-[calc(100%-30px)] bg-slate-200 z-0" />
              

              <div className="relative z-10 flex gap-3.5 items-start">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Booking Confirmed</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">2 Jul 2026 • 06:30 PM</p>
                </div>
              </div>


              <div className="relative z-10 flex gap-3.5 items-start">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Driver Assigned</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">2 Jul 2026 • 06:31 PM</p>
                </div>
              </div>


              <div className="relative z-10 flex gap-3.5 items-start">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full border-2 border-slate-900 bg-white ring-4 ring-slate-100" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Driver On The Way</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">2 Jul 2026 • 06:33 PM</p>
                </div>
              </div>


              <div className="relative z-10 flex gap-3.5 items-start opacity-40">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-slate-200" />
                <div>
                  <h5 className="text-xs font-bold text-slate-700">Trip Started</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">--:--</p>
                </div>
              </div>


              <div className="relative z-10 flex gap-3.5 items-start opacity-40">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-slate-200" />
                <div>
                  <h5 className="text-xs font-bold text-slate-700">Trip Completed</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">--:--</p>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#fbc843]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need Help?</h4>
                <p className="text-xs font-medium text-slate-400 leading-normal mt-0.5">
                  Contact our support team for any queries or issues.
                </p>
              </div>
            </div>
            
            <button className="w-full border border-slate-200 hover:bg-slate-50 font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-slate-700">
              <PhoneCall className="w-4 h-4 text-slate-700 stroke-[2]" />
              Contact Support
            </button>
          </div>

        </div>
      </div>


      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 pt-6 mt-8">
        <button className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4 text-slate-600 stroke-[2.5]" />
          Download Invoice
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-1.5">
            <XCircle className="w-4 h-4 stroke-[2.5]" />
            Cancel Trip
          </button>
          <button  onClick={() => router.push("/myprofile")} className="flex-1 sm:flex-none bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black text-xs py-3 px-8 rounded-xl shadow-md shadow-amber-100 transition-all flex items-center justify-center gap-2">
            <Radio className="w-4 h-4 stroke-[2.5] animate-pulse" />
            Track Live
          </button>
        </div>
      </div>

    </div>
  );
};

export default CurrentBookingDetails;