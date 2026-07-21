"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LiveTripMapWeb } from './LiveTripMapWeb';

const liveTripMapContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingId, setBookingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get bookingId from URL query param or fallback to sessionStorage
    const urlBookingId = searchParams.get('bookingId');
    let activeBookingId = urlBookingId;

    if (!activeBookingId) {
      const storedBooking = sessionStorage.getItem("activeInspectedBooking");
      if (storedBooking) {
        try {
          const parsed = JSON.parse(storedBooking);
          activeBookingId = parsed.bookingId;
        } catch (e) {
          console.error("Failed to parse booking from sessionStorage", e);
        }
      }
    }

    // 2. Fetch auth token (adjust key to match your auth storage strategy)
    const storedToken = localStorage.getItem("RydBazzarToken") || "DEMO_TOKEN";

    if (activeBookingId) {
      setBookingId(activeBookingId);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, [searchParams]);

  if (!bookingId || !token) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-bold">
        <div className="w-8 h-8 border-4 border-[#fbc843] border-t-transparent rounded-full animate-spin mb-4" />
        <p>Initializing Live Map...</p>
      </div>
    );
  }

  return (
    <LiveTripMapWeb 
      bookingId={bookingId} 
      token={token} 
      onBack={() => router.back()} 
    />
  );
};

export default liveTripMapContent;