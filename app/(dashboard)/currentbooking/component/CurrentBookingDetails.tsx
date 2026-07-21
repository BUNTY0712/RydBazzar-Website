import React, { useEffect, useState } from 'react';
import { 
  Copy, 
  Calendar, 
  Star, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  Download, 
  XCircle, 
  Radio 
} from 'lucide-react';
import { useRouter } from "next/navigation";

const CurrentBookingDetails = () => {
  const router = useRouter();
  
  // State to store the retrieved booking data
  const [bookingData, setBookingData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Grab the raw stringified data from sessionStorage
    const storedBooking = sessionStorage.getItem("activeInspectedBooking");
    
    if (storedBooking) {
      try {
        // 2. Parse it back into a JavaScript object
        const parsedData = JSON.parse(storedBooking);
        
        // 3. Log it to your browser console to verify
        console.log("Successfully retrieved booking data:", parsedData);
        
        // 4. Save it to local state so you can use it in your TSX/JSX
        setBookingData(parsedData);
      } catch (error) {
        console.error("Error parsing booking data from sessionStorage:", error);
      }
    } else {
      console.warn("No active inspected booking found in sessionStorage.");
    }
  }, []); // Empty dependency array ensures this runs exactly once on mount

  // Helper to copy Booking ID to clipboard
  const handleCopyId = () => {
    if (bookingData?.bookingId) {
      navigator.clipboard.writeText(bookingData.bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Graceful loading state until the client effect catches up
  if (!bookingData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-bold">
        <div className="w-8 h-8 border-4 border-[#fbc843] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  // Turn startOtp string ("749257") into a clean digit array. Falls back safely if missing.
  const otpDigits = bookingData.startOtp ? bookingData.startOtp.split('') : ['-', '-', '-', '-', '-', '-'];
const endOtpDigits = bookingData?.endOtp
  ? bookingData.endOtp.split("")
  : ["-", "-", "-", "-", "-", "-"];


  // Formatter for localized display dates
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'string') return '--';
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  // Convert status string into clean display text and match colors dynamically
  const formatStatus = (status: string) => {
    if (!status) return { label: 'Unknown', color: 'text-slate-500 bg-slate-100' };
    switch(status) {
      case 'PENDING_ACCEPT': return { label: 'Pending Acceptance', color: 'text-amber-600 bg-amber-50 animate-pulse' };
      case 'ASSIGNED': return { label: 'Assigned', color: 'text-emerald-600 bg-emerald-50' };
      case 'CANCELLED': return { label: 'Cancelled', color: 'text-red-600 bg-red-50' };
      default: return { label: status.replace('_', ' '), color: 'text-blue-600 bg-blue-50' };
    }
  };

  const currentStatus = formatStatus(bookingData.status);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 font-sans text-slate-800 bg-slate-50/50 min-h-screen">
      
      <div className="mb-6">
        <p className="text-2xl font-black text-[#0c1e36] tracking-tight">Current Booking</p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">View your current, upcoming and completed rides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-100/40 space-y-6">
            
            {/* Upper Info Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md uppercase">
                  {bookingData.tripType ? bookingData.tripType.replace('_', ' ') : 'One Way'}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <span>Booking ID: <span className="text-slate-900 font-bold">{bookingData.bookingId}</span></span>
                  <button onClick={handleCopyId} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                    {copied && <span className="text-[10px] text-emerald-500">Copied!</span>}
                  </button>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-black px-2 py-0.5 rounded ${currentStatus.color}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {currentStatus.label}
              </div>
            </div>

            {/* Core Info Triplet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Pick Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pick Time</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{formatDate(bookingData.pickupDate)}</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{bookingData.pickupTime} {bookingData.amOrPm || ''}</p>
                </div>
              </div>

              {/* Vehicle Type / Driver Placeholder */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100/30 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Vehicle Type</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <h4 className="text-sm font-black text-slate-900">{bookingData.vehicleTypeName || 'SEDAN'}</h4>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                      <span>--</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">Driver Allocation Pending</p>
                </div>
              </div>

              {/* Payment Blocks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Paid Amount</p>
                  <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[10px] px-2 py-0.5 rounded mt-1">
                    ₹{bookingData.paidAmount}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Remaining Bal.</p>
                  <p className="text-xs font-black text-red-600 mt-1">₹{bookingData.balance}</p>
                </div>
              </div>
            </div>

            {/* Map Address Route Block */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 md:p-5 space-y-5">
              
              {/* Pickup location */}
              <div className="flex gap-4 relative items-start">
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-emerald-500 shrink-0 mt-0.5 z-10" />
                <div className="absolute top-4 left-[7px] w-[2px] h-14 border-l-2 border-dashed border-slate-300 z-0" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">From</p>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{bookingData.fromLocation}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{bookingData.startState}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bookingData.distanceKm} km</span>
                  </div>
                </div>
              </div>

              {/* Dropoff location */}
              <div className="flex gap-4 items-start pt-1">
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-red-500 shrink-0 mt-0.5 z-10" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">To</p>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{bookingData.toLocation}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{bookingData.destinationState}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bookingData.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flat Embedded Quick Price summary */}
            <div className="bg-blue-50/30 border border-blue-100/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-6">
                <div>
                  <span className="text-xs font-bold text-slate-400">Base Fare</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">₹{bookingData.baseFare}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">GST ({bookingData.gstPercent}%)</span>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">₹{bookingData.gstAmount}</p>
                </div>
                {bookingData.addOnTotal > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-400">Add-ons</span>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">₹{bookingData.addOnTotal}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Grand Total</span>
                <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">₹{bookingData.totalAmount}</p>
              </div>
            </div>

          </div>

          {/* OTP Section */}
          <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-100/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Share OTP with driver</h4>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Share with the driver only when the vehicle has safely arrived.</p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 text-center md:text-right">Start Trip OTP</p>
             <div className="flex gap-1.5 justify-center">
  {otpDigits.map((digit: string, idx: number) => (
    <div
      key={idx}
      className="w-10 h-11 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center text-sm font-black text-slate-800"
    >
      {digit}
    </div>
  ))}
</div>
            </div>
            
          </div>
         {/* End OTP Section */}
<div className="bg-red-50/40 border border-red-100/60 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
  <div className="flex items-center gap-3.5">
    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 shadow-sm shadow-red-100/30">
      <CheckCircle2 className="w-5 h-5 text-red-600 fill-red-50" />
    </div>

    <div>
      <h4 className="text-sm font-bold text-slate-900">
        Share End OTP with driver
      </h4>
      <p className="text-xs font-bold text-slate-400 mt-0.5">
        Share with the driver only after your trip has been completed.
      </p>
    </div>
  </div>

  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
    <p className="text-[10px] uppercase font-black tracking-wider text-red-500 text-center md:text-right">
      End Trip OTP
    </p>

    <div className="flex gap-1.5 justify-center">
      {endOtpDigits.map((digit: string, idx: number) => (
        <div
          key={idx}
          className="w-10 h-11 bg-white border border-red-200 shadow-sm rounded-lg flex items-center justify-center text-sm font-black text-red-700"
        >
          {digit}
        </div>
      ))}
    </div>
  </div>
</div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed breakdown widget */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Copy className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Price Details Breakdown</h3>
            </div>
            
            <div className="space-y-3 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span className="text-slate-900 font-bold">₹{bookingData.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Route Fare</span>
                <span className="text-slate-900 font-bold">₹{bookingData.totalFare}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({bookingData.gstPercent}%)</span>
                <span className="text-slate-900 font-bold">₹{bookingData.gstAmount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span>Add-ons Total</span>
                <span className="text-slate-900 font-bold">₹{bookingData.addOnTotal}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-slate-900">Total Charged</span>
                <span className="text-lg font-black text-slate-900 tracking-tight">₹{bookingData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Status Timeline tracker */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Navigation className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Trip Timeline Status</h3>
            </div>

            <div className="space-y-5 relative pl-6 pt-1">
              <div className="absolute top-3 left-2 w-[2px] h-[calc(100%-30px)] bg-slate-200 z-0" />
              
              <div className="relative z-10 flex gap-3.5 items-start">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Booking Requested</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{bookingData.createdDate} • {bookingData.createdTime}</p>
                </div>
              </div>

              <div className="relative z-10 flex gap-3.5 items-start">
                <div className={`absolute -left-[22px] w-3 h-3 rounded-full border-2 bg-white ring-4 ${bookingData.status === 'PENDING_ACCEPT' ? 'border-amber-500 ring-amber-100 animate-pulse' : 'border-emerald-500 ring-emerald-100'}`} />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Awaiting Dispatch Acceptance</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Current Phase</p>
                </div>
              </div>

              <div className="relative z-10 flex gap-3.5 items-start opacity-40">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-slate-200" />
                <div>
                  <h5 className="text-xs font-bold text-slate-700">Trip Started</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Start OTP Required: {bookingData.startOtp}</p>
                </div>
              </div>

              <div className="relative z-10 flex gap-3.5 items-start opacity-40">
                <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-slate-200" />
                <div>
                  <h5 className="text-xs font-bold text-slate-700">Trip Completed</h5>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">End OTP Required: {bookingData.endOtp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support segment */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#fbc843]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need Help?</h4>
                <p className="text-xs font-medium text-slate-400 leading-normal mt-0.5">
                  Contact customer support reference for Mobile #{bookingData.phoneNumber || 'N/A'}.
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

      {/* Action Footer Actions Row */}
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
       {/* ✅ FIXED */}
<button 
  onClick={() => router.push(`/live-trip-map?bookingId=${bookingData.bookingId}`)} 
  className="flex-1 sm:flex-none bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black text-xs py-3 px-8 rounded-xl shadow-md shadow-amber-100 transition-all flex items-center justify-center gap-2"
>
  <Radio className="w-4 h-4 stroke-[2.5] animate-pulse" />
  Track Live
</button>
        </div>
      </div>

    </div>
  );
};

export default CurrentBookingDetails;