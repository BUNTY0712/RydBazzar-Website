'use client';

import React from 'react';
import { Calendar, ArrowUpDown } from 'lucide-react';

interface AllTripsButtonProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AllTripsButton = ({ activeTab, setActiveTab }: AllTripsButtonProps) => {
  // Added 'All Bookings' alongside your prior filters
  const tabs = ['All Bookings', 'Current', 'Past Trips', 'Upcoming'];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans text-slate-800">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#0c1e36] tracking-tight">
          All Trips
        </h2>
        <p className="text-xs font-medium text-slate-500 mt-1">
          View your current, upcoming and completed rides.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#fbc843] text-[#0c1e36] shadow-sm'
                    : 'bg-amber-50/40 border border-amber-100/30 text-[#0c1e36]/80 hover:bg-amber-100/30'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-150">
            <Calendar className="w-3.5 h-3.5 text-slate-700 stroke-[2]" />
            <span>Date Range</span>
          </button>

          <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-150">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-700 stroke-[2]" />
            <span>Sort by: Recent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllTripsButton;