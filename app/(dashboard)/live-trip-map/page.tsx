"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 1. Dynamically import Leaflet component with SSR completely turned OFF
const LiveTripMapWeb = dynamic(
  () => import('./component/LiveTripMapWeb').then((mod) => mod.LiveTripMapWeb),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-600 font-bold">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p>Loading Map Component...</p>
      </div>
    )
  }
);

// Inner component to safely handle URL Search Params
function LiveTripMapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId') || '';

  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const savedToken = localStorage.getItem('RydBazzarToken') || '';
    setToken(savedToken);
  }, []);

  return (
    <LiveTripMapWeb
      bookingId={bookingId}
      token={token}
      onBack={() => router.back()}
    />
  );
}

// 2. Main Page Component wrapped in Suspense
export default function Page() {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-slate-100 text-slate-500 font-bold">
          Loading page details...
        </div>
      }
    >
      <LiveTripMapContent />
    </Suspense>
  );
}