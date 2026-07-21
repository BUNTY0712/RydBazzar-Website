'use client';

import React, { useState, useEffect } from 'react';
import AllTripsButton from './AllTripsButton';
import AllTripDetails from './AllTripDetails';
import { 
  useGetUserBookingsQuery,
  useGetCurrentTripsQuery, 
  useGetPastTripsQuery, 
  useGetUpcomingTripsQuery 
} from "@/app/store/api/tripApi";
import { Loader2 } from 'lucide-react';

const AllTripsContent = () => {
  // Switched initial default to 'All Bookings'
  const [activeTab, setActiveTab] = useState<string>('All Bookings');
  const [userPhone, setUserPhone] = useState<string>('9901030543');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("RydBazzarUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.phoneNumber) setUserPhone(parsed.phoneNumber);
      }
    } catch (e) {
      console.error("Failed parsing cached credentials:", e);
    }
  }, []);

  const queryParams = { mobile: userPhone, page: 0, size: 20 };

  // 1. Hook for the brand new general bookings collection (destructuring refetch)
  const allBookingsQuery = useGetUserBookingsQuery({
    page: 0,
    size: 20,
    sortBy: "createdAt",
    sortDir: "DESC",
  });

  // 2. Original localized state filters (destructuring refetch)
  const currentQuery = useGetCurrentTripsQuery(queryParams, { skip: activeTab !== 'Current' });
  const pastQuery = useGetPastTripsQuery(queryParams, { skip: activeTab !== 'Past Trips' });
  const upcomingQuery = useGetUpcomingTripsQuery(queryParams, { skip: activeTab !== 'Upcoming' });

  // Refresh handler: Triggers the refetch method corresponding to the active tab
  const handleRefresh = () => {
    if (activeTab === 'All Bookings') {
      allBookingsQuery.refetch();
    } else if (activeTab === 'Current') {
      currentQuery.refetch();
    } else if (activeTab === 'Past Trips') {
      pastQuery.refetch();
    } else if (activeTab === 'Upcoming') {
      upcomingQuery.refetch();
    }
  };

  // Compute absolute loading tracking frames
  const isLoading = 
    allBookingsQuery.isFetching || 
    currentQuery.isFetching || 
    pastQuery.isFetching || 
    upcomingQuery.isFetching;
  
  const getActiveData = () => {
    if (activeTab === 'All Bookings') return allBookingsQuery.data;
    if (activeTab === 'Current') return currentQuery.data;
    if (activeTab === 'Past Trips') return pastQuery.data;
    return upcomingQuery.data;
  };

  const rawData = getActiveData();
  const tripList = rawData?.content || (Array.isArray(rawData) ? rawData : []);

  // Diagnostics Engine Logs: Tracks active pipeline switches
  useEffect(() => {
    console.log(`[Trip Dashboard] Active Tab: "${activeTab}"`);
    console.log(`[Trip Dashboard] Current Query Data Object:`, rawData?.content);
    console.log(`[Trip Dashboard] Normalized list sent to UI rows (${tripList.length} items):`, tripList);
  }, [activeTab, rawData, tripList]);

  return (
    <>
      <AllTripsButton activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {isLoading ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-[#fbc843]" size={36} />
          <p className="text-xs font-bold text-slate-400">Loading your trip history records...</p>
        </div>
      ) : (
        <AllTripDetails 
          trips={tripList} 
          activeTab={activeTab} 
          onRefresh={handleRefresh} 
        />
      )}
    </>
  );
};

export default AllTripsContent;