'use client';

import React, { useEffect, useState } from 'react';
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
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { 
  useGetAvailableAddonsQuery, 
  useCreateFinalBookingMutation 
} from "@/app/store/api/paymentApi";

const PaymentSummary = ({ data: initialRouteData }: any) => {
  const router = useRouter();
  
  // App contexts states
  const [contextData, setContextData] = useState<any>(initialRouteData || null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const [selectedPayment, setSelectedPayment] = useState<string>('part-pay');
  const [couponCode, setCouponCode] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  // RTK Mutation Hook dispatch mapping configuration
  const [createBooking, { isLoading: isBookingLoading }] = useCreateFinalBookingMutation();
  const { data: addonsList, isLoading: addonsLoading } = useGetAvailableAddonsQuery();

  // Load contextual references from storage cache safely on load mount
  useEffect(() => {
    if (!contextData) {
      const cachedContext = sessionStorage.getItem("bookingContextData");
      if (cachedContext) setContextData(JSON.parse(cachedContext));
    }
    const cachedVehicle = sessionStorage.getItem("selectedVehicleOption");
    console.log("selectedVehicleOption", cachedVehicle);
    if (cachedVehicle) setSelectedVehicle(JSON.parse(cachedVehicle));
  }, [contextData]);

  const handleCheckboxChange = (id: string) => {
    setSelectedAddons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- DYNAMIC PRICE CALCULATION LOGIC ---
  const baseTotalAmount = selectedVehicle?.totalAmount || 0;
  
  // Calculate aggregate price of checked addons
  const addonsTotalCost = Object.keys(selectedAddons).reduce((sum, addonId) => {
    if (!selectedAddons[addonId] || !addonsList) return sum;
    const matchedAddon = addonsList.find((a: any) => (a.id || a._id || a.name) === addonId);
    const cost = matchedAddon ? (matchedAddon.price ?? matchedAddon.cost ?? 0) : 0;
    return sum + Number(cost);
  }, 0);

  // Compute absolute dynamic totals
  const finalTotalAmount = baseTotalAmount + addonsTotalCost;
  const finalAdvanceAmount = selectedVehicle?.advanceAmount 
    ? (selectedVehicle.advanceAmount + addonsTotalCost) 
    : (finalTotalAmount / 2); // Fallback standard calculation

  const handleBookingSubmit = async () => {
    if (!contextData || !selectedVehicle) {
      alert("Missing essential context parameters or car options.");
      return;
    }

    // Isolate active price matrix fields safely
    const priceDetails = selectedVehicle.bestPriceWithoutToll || selectedVehicle.bestPriceWithToll || {};
    
    // Extract dynamic keys of active checked addon variables into an array list context
    const checkedAddonIds = Object.keys(selectedAddons).filter(key => selectedAddons[key]);

    // Build user phone fallback validation references
    let userPhone = contextData?.phoneNumber || "9901030543";
    try {
      const storedUser = localStorage.getItem("RydBazzarUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.phoneNumber) userPhone = parsed.phoneNumber;
      }
    } catch (e) {
      console.error(e);
    }

    // Match required exact layout structure payload parameters matching buildBookingBody schema
    const bookingPayload = {
      totalKm: contextData?.distanceKm,
      distanceKm: contextData?.distanceKm,
      durationMinutes: contextData?.durationMinutes,
      tripType: contextData?.tripType || "ONE_WAY",
      pickupDate: contextData?.pickupDate,
      pickupTime: contextData?.pickupTime,
      amOrPm: contextData?.amOrPm,

      vehicleTypeName: selectedVehicle?.vehicleTypeName,
      bestPriceWithTollFlg: selectedVehicle?.bestPriceWithTollFlg || false,
      costPerKm: selectedVehicle?.costPerKm,

      fromLatitude: contextData?.fromLatitude,
      fromLongitude: contextData?.fromLongitude,
      toLatitude: contextData?.toLatitude,
      toLongitude: contextData?.toLongitude,
      fromLocation: contextData?.fromLocation,
      toLocation: contextData?.toLocation,
      startState: contextData?.startState || "",
      destinationState: contextData?.destinationState || "",

      returnDate: contextData?.returnDate || "string",
      returnTime: contextData?.returnTime || "6:00",
      returnAmOrPm: contextData?.returnAmOrPm || "PM",
      intermediateStops: contextData?.intermediateStops || [],
      
      baseFare: priceDetails.baseFare || 0,
      discountPercent: priceDetails.discountPercent || 0,
      discountAmount: priceDetails.discountAmount || 0,
      fareAfterDiscount: priceDetails.fareAfterDiscount || 0,
      commissionPercent: priceDetails.commissionPercent || 0,
      commissionAmount: priceDetails.commissionAmount || 0,
      gstPercent: priceDetails.gstPercent || 0,
      gstAmount: priceDetails.gstAmount || 0,
      totalFare: finalTotalAmount, // Submitting full aggregate total value including options selection matrix

      tollAmount: 0,
      statePermitAmount: 0,

      promoCode: couponCode || "",
      platform: "MOBILE",
      preferredDriverLanguage: "English", 
      phoneNumber: userPhone,
      status: "PENDING_PAYMENT",
      selectedAddOnIds: checkedAddonIds, // Structured dynamic array conversion matching index maps

      quoteRequestId: contextData?.quoteRequestId
    };

    console.log("Dispatching final booking transaction body payload:", bookingPayload);

    try {
      await createBooking(bookingPayload).unwrap();
      router.push("/alltrips");
    } catch (err) {
      console.error("Booking dispatch process error failed:", err);
      alert("Something went wrong creating your reservation record context profile.");
    }
  };

  const formattedTripType = contextData?.tripType === "ONE_WAY" ? "One Way" : contextData?.tripType || "One Way";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans text-slate-800 selection:bg-yellow-400">
      
      {/* Step Tracker Layout */}
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
        <span className="text-xs font-bold text-emerald-700">Good news! Free cancellation till 1 hour of departure</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          
          {/* Summary Details Panel Box */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
            <div className="bg-[#0c1e36] px-5 py-3.5 text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-300" />
              <h3 className="text-sm font-bold tracking-wide">Trip Details</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  {contextData?.fromLocation?.split(',')[0]} <span className="text-slate-400 font-normal">➔</span> {contextData?.toLocation?.split(',')[0]}
                  <span className="text-xs font-bold text-slate-400 ml-1">({formattedTripType})</span>
                </h4>
                <div className="mt-2 space-y-0.5 text-xs font-bold text-slate-700">
                  <p><span className="text-slate-400 font-semibold">Car Type:</span> {selectedVehicle?.vehicleTypeName || "Wagon R or Equivalent"}</p>
                  <p><span className="text-slate-400 font-semibold">Fuel Type:</span> CNG</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-amber-600" /></div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Pickup Date</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">{contextData?.pickupDate}</p>
                  </div>
                </div>
                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-amber-600" /></div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Pickup Time</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">{contextData?.pickupTime} {contextData?.amOrPm}</p>
                  </div>
                </div>
                <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-amber-600" /></div>
                  <div>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Distance</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 whitespace-nowrap">{contextData?.distanceKm} km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons Checklist Rendering Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <Star className="w-4 h-4 text-slate-800 fill-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Other Terms & Addons</h3>
            </div>

            {addonsLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[#fbc843]" size={24} /></div>
            ) : (
              <div className="space-y-3">
                {addonsList && addonsList.length > 0 ? (
                  addonsList.map((addon: any) => {
                    const addonId = addon.id || addon._id || addon.name;
                    return (
                      <label key={addonId} className="flex items-start justify-between gap-4 cursor-pointer p-1 hover:bg-slate-50/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={!!selectedAddons[addonId]} 
                            onChange={() => handleCheckboxChange(addonId)} 
                            className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4" 
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{addon.title || addon.description || addon.name}</span>
                            {addon.badge && <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full w-max mt-0.5">{addon.badge}</span>}
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900 shrink-0">₹{addon.price ?? addon.cost}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-xs font-semibold text-slate-400 text-center py-2">No additional add-ons available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary Right Panel Side Elements */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <CreditCard className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900">Payment Options</h3>
            </div>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'zero' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment-group" checked={selectedPayment === 'zero'} onChange={() => setSelectedPayment('zero')} className="w-4 h-4 accent-yellow-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Book at Zero</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pay Later</p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">₹0</span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'part-pay' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment-group" checked={selectedPayment === 'part-pay'} onChange={() => setSelectedPayment('part-pay')} className="w-4 h-4 accent-yellow-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Part Pay</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pay advance amount now</p>
                  </div>
                </div>
                {/* Dynamically incremented advance amount */}
                <span className="text-sm font-black text-slate-900">₹{finalTotalAmount.toFixed(2)/2}</span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === 'full-pay' ? 'border-[#fbc843] bg-amber-50/10' : 'border-slate-100 hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment-group" checked={selectedPayment === 'full-pay'} onChange={() => setSelectedPayment('full-pay')} className="w-4 h-4 accent-yellow-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Full Pay</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Full Pay amount now</p>
                  </div>
                </div>
                {/* Dynamically incremented total amount */}
                <span className="text-sm font-black text-slate-900">₹{finalTotalAmount.toFixed(2)}</span>
              </label>
            </div>

            {/* Coupons Field Box */}
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
                  className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-slate-400 text-slate-800" 
                />
                <button className="bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-bold text-xs px-6 py-2.5 rounded-xl transition-colors">Apply</button>
              </div>
            </div>

            {/* Dynamic Submission Action CTA Grid Trigger */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleBookingSubmit} 
                disabled={isBookingLoading}
                className="w-full bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black py-3.5 rounded-xl text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isBookingLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>Proceed to Pay <ArrowRight className="w-3.5 h-3.5 stroke-[3]" /></>
                )}
              </button>

              <button className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 px-1 pt-1">
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