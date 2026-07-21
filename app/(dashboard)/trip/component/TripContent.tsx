"use client";

import React, { useEffect, useState } from 'react';
import TripBanner from './TripBanner';
import ChoosePerfectRide from './ChoosePerfectRide';
import { Loader2 } from 'lucide-react';

const TripContent = () => {
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem("currentTripQuote");
    if (cachedData) {
      setTripData(JSON.parse(cachedData));
    }
  }, []);

  if (!tripData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#fbc843]" size={40} />
        <p className="text-sm font-semibold text-slate-500">Loading your trip choices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TripBanner data={tripData} />
      <ChoosePerfectRide data={tripData} />
    </div>
  );
};

export default TripContent;