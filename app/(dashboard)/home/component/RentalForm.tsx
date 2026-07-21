"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLazyGetLocationSuggestionsQuery } from "@/app/store/api/homeApi"; 
import { useGetRentalFareQuoteMutation } from "@/app/store/api/rentalApi";

interface LocationInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeInput: (val: string) => void;
  onSelectSuggestion: (item: any) => void;
}

const LocationInput = ({ label, value, placeholder, onChangeInput, onSelectSuggestion }: LocationInputProps) => {
  const [trigger, { data: response, isFetching }] = useLazyGetLocationSuggestionsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestionsList = response?.suggestions || [];

  useEffect(() => {
    if (value.trim().length > 2 && isFocused) {
      trigger({ query: value, limit: 5 });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [value, trigger, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-sm font-bold text-gray-800 block mb-2">{label}</label>
      <div className="relative flex items-center">
        {/* Status Dot Accent */}
        <span className="absolute left-3.5 w-2.5 h-2.5 rounded-full bg-emerald-500 z-10" />
        <input
          value={value}
          onChange={(e) => {
            setIsFocused(true);
            onChangeInput(e.target.value);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (value.trim().length > 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg py-3 pl-8 pr-10 outline-none text-sm text-gray-700 placeholder-gray-400 focus:border-gray-400 transition-colors bg-white"
        />
        {isFetching && (
          <Loader2 size={18} className="absolute right-3.5 animate-spin text-gray-400" />
        )}
      </div>

      {isOpen && suggestionsList.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-100 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg divide-y divide-gray-100">
          {suggestionsList.map((item: any) => (
            <li
              key={item.placeId || item.orderIndex}
              onClick={() => {
                setIsFocused(false);
                onSelectSuggestion(item);
                setIsOpen(false);
              }}
              className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
            >
              <span className="font-semibold block">{item.placeName}</span>
              <span className="text-xs text-gray-400">{item.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RentalForm = () => {
  const router = useRouter();
  const [getRentalFareQuote, { isLoading }] = useGetRentalFareQuoteMutation();

  const hoursData = [2, 4, 8];
  const [selectedHour, setSelectedHour] = useState<number>(2);

  const [form, setForm] = useState({
    pickup: { address: "", latitude: null as number | null, longitude: null as number | null },
    date: "",
    time: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      pickup: { ...prev.pickup, address: value },
    }));
  };

  const handleSelectLocation = (item: any) => {
    setForm((prev) => ({
      ...prev,
      pickup: {
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
      },
    }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!form.pickup.address) {
      setErrorMessage("Please enter and select a valid pickup location.");
      return;
    }
    if (!form.date || !form.time) {
      setErrorMessage("Please select both date and time.");
      return;
    }

    let formattedTime = form.time;
    let amOrPm = "AM";
    
    if (form.time) {
      const [hoursStr, minutesStr] = form.time.split(":");
      let hours = parseInt(hoursStr, 10);
      amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      formattedTime = `${hours}:${minutesStr}`;
    }

    let userPhone = "9901030543";
    try {
      const storedUser = localStorage.getItem("RydBazzarUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.mobile) userPhone = parsed.mobile;
      }
    } catch (e) {
      console.error("Failed parsing user credentials:", e);
    }

    const payload = {
      phoneNumber: userPhone,
      role: "CUSTOMER",
      fromLocation: form.pickup.address,
      fromLatitude: form.pickup.latitude ?? 13.0475,
      fromLongitude: form.pickup.longitude ?? 80.2825,
      pickupDate: form.date,
      pickupTime: formattedTime,
      amOrPm: amOrPm,
      tripType: "RENTAL",
      durationHours: selectedHour,
      returnDate: "",
      returnTime: "",
      returnAmOrPm: "",
      intermediateStops: [],
    };

    try {
      const resData = await getRentalFareQuote(payload).unwrap();

      if (resData) {
        sessionStorage.setItem("currentRentalQuote", JSON.stringify(resData));
        sessionStorage.setItem("rentalBookingPayload", JSON.stringify(payload));
        router.push("/rental-trip");
      }
    } catch (error: any) {
      console.error("Rental Fare Quote failed:", error);
      setErrorMessage(
        error?.data?.message || "Failed to fetch rental fare. Please try again."
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Pickup Location */}
      <LocationInput
        label="Pickup Location"
        value={form.pickup.address}
        placeholder="Enter pickup location for rental"
        onChangeInput={handleInputChange}
        onSelectSuggestion={handleSelectLocation}
      />

      {/* Select Rental Package */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Select Rental Package</label>
        <div className="grid grid-cols-3 gap-2.5">
          {hoursData.map((hour) => {
            const isSelected = selectedHour === hour;
            return (
              <button
                key={hour}
                type="button"
                onClick={() => setSelectedHour(hour)}
                className={`py-3 px-2 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-[#facc15] border-[#facc15] text-gray-900 shadow-sm"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ShieldCheck
                  size={16}
                  className={isSelected ? "text-gray-900" : "text-gray-400"}
                />
                {hour} Hours
              </button>
            );
          })}
        </div>
      </div>

      {/* Date & Time */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Date & Time</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative flex items-center">
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors bg-white"
            />
            {/* <Calendar size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>

          <div className="relative flex items-center">
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleFieldChange("time", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors bg-white"
            />
            {/* <Clock size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#facc15] hover:bg-[#eab308] text-gray-900 py-3.5 rounded-xl font-bold text-base transition-colors flex justify-center items-center gap-2 shadow-sm mt-2 disabled:opacity-50 cursor-pointer"
      >
        {isLoading && <Loader2 size={18} className="animate-spin text-gray-900" />}
        {isLoading ? "Fetching Fare..." : "Confirm Rental Booking"}
      </button>
    </div>
  );
};

export default RentalForm;