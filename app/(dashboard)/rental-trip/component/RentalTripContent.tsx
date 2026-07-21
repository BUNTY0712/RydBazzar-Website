"use client";

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import RentalTripBanner from './RentalTripBanner';
import RentalChoosePerfectRide from './RentalChoosePerfectRide';

const RentalTripContent = () => {
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    // Read from 'currentRentalQuote' saved in RentalForm.tsx
    const cachedData = 
      sessionStorage.getItem("currentRentalQuote") || 
      sessionStorage.getItem("currentTripQuote");

    if (cachedData) {
      setTripData(JSON.parse(cachedData));
    }
  }, []);

  if (!tripData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#fbc843]" size={40} />
        <p className="text-sm font-semibold text-slate-500">Loading your rental choices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RentalTripBanner data={tripData} />
      <RentalChoosePerfectRide data={tripData} />
    </div>
  );
};

export default RentalTripContent;