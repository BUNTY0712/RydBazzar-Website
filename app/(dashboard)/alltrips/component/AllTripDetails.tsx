'use client';

import React from 'react';
import { Star, Car, Wallet, FileDown, Inbox, RotateCw, Tag, PlusCircle } from 'lucide-react';
import { useRouter } from "next/navigation";

interface AllTripDetailsProps {
  trips: any[];
  activeTab: string;
  onRefresh?: () => void;
}

const AllTripDetails = ({ trips, activeTab, onRefresh }: AllTripDetailsProps) => {
  const router = useRouter();

  if (!trips || trips.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3">
        <Inbox className="w-8 h-8 text-slate-300 stroke-[1.5]" />
        <p className="text-sm font-semibold text-slate-400">
          No {activeTab.toLowerCase()} records found.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans text-slate-800 space-y-6">
      {/* Header bar with Refresh Button */}
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Total Trips: {trips.length}
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
            title="Refresh Trips"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {trips.map((trip: any, idx: number) => {
        const uniqueId = trip.id || trip.bookingId || trip.quoteRequestId || idx;

        // Dynamic Calculations
        const isCancelled = trip.status === "CANCELLED";
        const statusLabel = trip.status || (activeTab === "Past Trips" ? "Completed" : "Active");
        
        // AddOn logic computation
        const addOnTotal = trip.selectedAddOns 
          ? (Array.isArray(trip.selectedAddOns) 
              ? trip.selectedAddOns.reduce((acc: number, item: any) => acc + (item.price || 0), 0)
              : trip.selectedAddOns)
          : 0;

        return (
          <div
            key={uniqueId}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl shadow-slate-100/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative overflow-hidden"
          >
            {/* Left Column: Dates and Status Badges */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Trip Date</p>
                <h3 className="text-base font-black text-slate-900 mt-0.5 tracking-tight">
                  {trip.pickupDate || "N/A"}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {trip.pickupTime} {trip.amOrPm}
                </p>
              </div>

              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                    isCancelled
                      ? 'bg-red-50 border border-red-100/50 text-red-600'
                      : 'bg-emerald-50 border border-emerald-100/50 text-emerald-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Middle Column: Routing Maps Context */}
            <div className="md:col-span-4 flex gap-4 relative">
              <div className="flex flex-col items-center justify-between py-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="w-[2px] flex-1 my-1 bg-gradient-to-b from-emerald-400 via-amber-400 to-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pickup</p>
                  <p
                    className="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug truncate max-w-[280px]"
                    title={trip.fromLocation}
                  >
                    {trip.fromLocation || "Not Configured"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Destination</p>
                  <p
                    className="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug truncate max-w-[280px]"
                    title={trip.toLocation}
                  >
                    {trip.toLocation || "Not Configured"}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-[1px] bg-slate-100 my-1 mx-auto" />

            {/* Right-Middle: Assigned Driver & Trip Type Metadata Profile */}
            <div className="md:col-span-3 flex items-start gap-4 pt-1">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 font-bold shrink-0 text-sm">
                {trip.driverName?.charAt(0) || trip.vehicleTypeName?.charAt(0) || "C"}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-black text-slate-900">
                    {trip.driverName || "Assigning Driver..."}
                  </h4>
                  {trip.driverRating && (
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                      <span>{trip.driverRating}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Car className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                  <span>{trip.vehicleTypeName || "Standard Cab"}</span>
                </div>

                {/* Trip Type Badge */}
                {trip.tripType && (
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded border border-amber-200/50 mt-1 mr-1">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{trip.tripType}</span>
                  </div>
                )}

                {trip.plateNumber && (
                  <div className="inline-block bg-blue-50/70 text-[#0c1e36] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded border border-blue-100/40 mt-1">
                    {trip.plateNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Far Right Column: Pricing Calculations, AddOns, and Invoice Action Trigger */}
            <div className="md:col-span-2 flex flex-col md:items-end justify-between text-left md:text-right space-y-4 md:space-y-0">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Trip Fare</p>
                <h2 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
                  ₹{trip.totalFare ?? trip.baseFare ?? "0.00"}
                </h2>

                {/* Add-on Display */}
                {addOnTotal > 0 && (
                  <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                    <PlusCircle className="w-3 h-3" />
                    <span>Add-ons: ₹{addOnTotal}</span>
                  </div>
                )}

                <div className="flex md:justify-end items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                  <Wallet className="w-3 h-3 text-slate-400" />
                  <span>{trip.paymentMethod || "Deferred Payment"}</span>
                </div>
              </div>

              {activeTab === "All Bookings" && (
                <button
                  onClick={() => {
                    sessionStorage.setItem("activeInspectedBooking", JSON.stringify(trip));
                    router.push("/currentbooking");
                  }}
                  className="w-full bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black text-xs py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  View Info
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTripDetails;