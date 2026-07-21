"use client";

import React, { useState } from "react";
import BgImage from "../../../src/assets/Image/bgImage.png";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Car } from "lucide-react";
import OneWayForm from "./OneWayForm";
import RoundTripForm from "./RoundTripForm";
import AirportForm from "./AirportForm";
import RentalForm from "./RentalForm";

const Banner = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"oneway" | "round" | "airport" | "rental">("oneway");

  const tabs = [
    { id: "oneway", label: "One Way" },
    { id: "round", label: "Round Trip" },
    { id: "airport", label: "Airport" },
    { id: "rental", label: "Rental" },
  ];

  return (
    <div
      className="min-h-[calc(100vh-80px)] w-full flex items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${BgImage.src})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12 w-full grid lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Hero Section */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#1a2333]">
            Cab Booking Made Easy
          </span>

          <h1 className="text-5xl font-black text-[#1a2333] leading-tight">
            Safe. Reliable.
            <br />
            Always <span className="text-[#fbc843]">On Time.</span>
          </h1>

          <p className="text-gray-700 max-w-xl">
Book affordable cab rides anytime, anywhere.  Professional drivers, clean cars, transparent pricing, and smooth travel experiences for city rides, airport transfers, and outstation trips.
          </p>

          <button
            onClick={() => router.push("/alltrips")}
            className="bg-[#fbc843] hover:bg-[#e2b33c] transition-colors text-gray-900 px-8 py-3 rounded-lg font-bold w-fit shadow-sm"
          >
            Book Now
          </button>

          <div className="flex flex-wrap gap-6 pt-6 text-sm font-medium text-gray-800">
            <div className="flex gap-2 items-center">
              <Car className="text-[#fbc843]" size={20} />
              24/7 Availability
            </div>
            <div className="flex gap-2 items-center">
              <ShieldCheck className="text-[#fbc843]" size={20} />
              Verified Drivers
            </div>
            <div className="flex gap-2 items-center">
              <CreditCard className="text-[#fbc843]" size={20} />
              Secure Payments
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-5 flex justify-end">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">
              Choose Your Journey
            </h2>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-5">
              {tabs.map((t) => {
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id as any)}
                    className={`relative pb-2 text-sm font-semibold transition-colors ${
                      isActive ? "text-[#f5b800]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f5b800] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Render Selected Form */}
            {tab === "oneway" && <OneWayForm />}
            {tab === "round" && <RoundTripForm />}
            {tab === "airport" && <AirportForm />}
            {tab === "rental" && <RentalForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;