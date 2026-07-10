import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Star, 
  CreditCard, 
  Ticket, 
  ArrowRight, 
  ChevronDown 
} from 'lucide-react';
import { useRouter } from "next/navigation";

const PaymentSummary = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>('part-pay');
  const [couponCode, setCouponCode] = useState<string>('');
     const router = useRouter();
  

  const [addOns, setAddOns] = useState<Record<string, boolean>>({
    coupon: false,
    luggage: false,
    assuredSpace: false,
    pet: false,
    refundable: false,
    carModel: false,
    driverLanguage: false,
  });

  const handleCheckboxChange = (key: string) => {
    setAddOns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans text-slate-800 selection:bg-yellow-400">
      

      <div className="flex items-center justify-center max-w-xl mx-auto mb-6 relative px-4">
        <div className="absolute top-4 left-12 right-12 h-[1px] bg-slate-200 z-0" />
        
        <div className="flex flex-col items-center relative z-10 flex-1">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-sm">1</div>
          <span className="text-[11px] font-bold text-slate-900 mt-2">Select Car</span>
        </div>
        
        <div className="flex flex-col items-center relative z-10 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#fbc843] text-slate-900 text-xs font-bold flex items-center justify-center shadow-sm">2</div>
          <span className="text-[11px] font-bold text-slate-900 mt-2">Review & Details</span>
        </div>
        
        <div className="flex flex-col items-center relative z-10 flex-1">
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 text-xs font-bold flex items-center justify-center shadow-sm">3</div>
          <span className="text-[11px] font-bold text-slate-400 mt-2">Payment</span>
        </div>
      </div>


      <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 fill-emerald-50" />
        <span className="text-xs font-bold text-emerald-700">
          Good news! Free cancellation till 1 hour of departure
        </span>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        

        <div className="lg:col-span-7 space-y-6">
          

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
            <div className="bg-[#0c1e36] px-5 py-3.5 text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-300" />
              <h3 className="text-sm font-bold tracking-wide">Trip Details</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  Mumbai <span className="text-slate-400 font-normal">➔</span> Bangalore 
                  <span className="text-xs font-bold text-slate-400 ml-1">(Oneway)</span>
                </h4>
                <div className="mt-2 space-y-0.5 text-xs font-bold text-slate-700">
                  <p><span className="text-slate-400 font-semibold">Car Type:</span> Wagon R or Equivalent</p>
                  <p><span className="text-slate-400 font-semibold">Fuel Type:</span> CNG</p>
                </div>
              </div>


              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Pickup Date</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">22 Jun 2026</p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Pickup Time</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">07:00 AM</p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Distance</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">1020 kms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Star className="w-4 h-4 text-slate-800 fill-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Other Terms</h3>
            </div>

            <div className="space-y-3">

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.coupon} onChange={() => handleCheckboxChange('coupon')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4 mt-0.5" />
                  <span className="text-xs font-bold text-amber-500 hover:text-amber-600">Have coupon, rewards or vouchers?</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹249</span>
              </label>


              <div className="flex items-center gap-2 pt-1">
                <Star className="w-3.5 h-3.5 text-slate-800 fill-slate-800" />
                <h4 className="text-xs font-bold text-slate-900">Have Billing Info?</h4>
              </div>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.luggage} onChange={() => handleCheckboxChange('luggage')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700">Cab with Luggage Carrier</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Most Popular</span>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900">₹149</span>
              </label>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.assuredSpace} onChange={() => handleCheckboxChange('assuredSpace')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700">Assured luggage space for Rs. 250</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹249</span>
              </label>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.pet} onChange={() => handleCheckboxChange('pet')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700">Pet Allowed for Rs. 200</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹1.1/km</span>
              </label>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.refundable} onChange={() => handleCheckboxChange('refundable')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700">Upgrade to Refundable booking for Rs. 300</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹199</span>
              </label>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.carModel} onChange={() => handleCheckboxChange('carModel')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700">Confirmed Car Model 2022 or above for Rs. 150</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹249</span>
              </label>


              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={addOns.driverLanguage} onChange={() => handleCheckboxChange('driverLanguage')} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700">Preferred Driver language for Rs. 100</span>
                </div>
                <span className="text-xs font-black text-slate-900">₹249</span>
              </label>
            </div>


            <p className="text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-50">
              I agree with the <span className="text-amber-500 underline cursor-pointer">Terms of use</span> and <span className="text-amber-500 underline cursor-pointer">Cancellation Policy</span>.
            </p>
          </div>
        </div>


        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-5 space-y-5">
            
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <CreditCard className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Payment Options</h3>
            </div>


            <div className="space-y-3">

              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPayment === 'zero' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input
  type="radio"
  name="payment-group"
  checked={selectedPayment === 'zero'}
  onChange={() => setSelectedPayment('zero')}
  className="w-4 h-4 accent-yellow-400 border-white-300 focus:ring-yellow-400"
/>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Book at Zero</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pay ₹25299 Later</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">₹0</span>
              </label>


              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPayment === 'part-pay' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment-group" checked={selectedPayment === 'part-pay'} onChange={() => setSelectedPayment('part-pay')} className="w-4 h-4 accent-yellow-400 border-white-300 focus:ring-yellow-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Part Pay</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 max-w-[180px] leading-tight">Pay 25% now and rest to the driver</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">₹6325</span>
              </label>


              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPayment === 'full' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment-group" checked={selectedPayment === 'full'} onChange={() => setSelectedPayment('full')} className="w-4 h-4 accent-yellow-400 border-white-300 focus:ring-yellow-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Full Pay</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pay full amount now</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">₹25299</span>
              </label>
            </div>


            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-slate-800" />
                <h4 className="text-xs font-bold text-slate-900">Coupon & Offers</h4>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code" 
                  className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-slate-400 text-slate-800"
                />
                <button className="bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors">
                  Apply
                </button>
              </div>
            </div>


            <div className="space-y-3 pt-2">
              <button onClick={() => router.push("/alltrips")} className="w-full bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black py-3.5 rounded-xl text-xs tracking-wide transition-all shadow-md shadow-amber-100 flex items-center justify-center gap-1.5">
                Proceed to Pay <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <button className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 px-1 transition-colors pt-1">
                <span>View Fare Breakup</span>
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSummary;