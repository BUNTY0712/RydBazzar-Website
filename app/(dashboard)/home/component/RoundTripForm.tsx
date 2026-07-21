"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  useLazyGetLocationSuggestionsQuery, 
  useGetBestPriceWithoutTollMutation 
} from "@/app/store/api/homeApi";

interface LocationInputProps {
  label: string;
  value: string;
  placeholder: string;
  dotColor: "green" | "red";
  onChangeInput: (val: string) => void;
  onSelectSuggestion: (item: any) => void;
}

// Reusable Autocomplete Input Component
const LocationInput = ({
  label,
  value,
  placeholder,
  dotColor,
  onChangeInput,
  onSelectSuggestion,
}: LocationInputProps) => {
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
        <span
          className={`absolute left-3.5 w-2.5 h-2.5 rounded-full z-10 ${
            dotColor === "green" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
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
          className="w-full border border-gray-200 rounded-lg py-3 pl-8 pr-10 outline-none text-sm text-gray-700 placeholder-gray-400 focus:border-gray-400 transition-colors"
        />
        {isFetching && (
          <Loader2 size={18} className="absolute right-3 animate-spin text-gray-400" />
        )}
      </div>

      {/* Suggestion Dropdown Panel */}
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

const RoundTripForm = () => {
  const router = useRouter();
  
  const [getBestPrice, { isLoading }] = useGetBestPriceWithoutTollMutation();

  const [form, setForm] = useState({
    pickup: { address: "", latitude: null as number | null, longitude: null as number | null },
    drop: { address: "", latitude: null as number | null, longitude: null as number | null },
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    vehicle: "",
  });

  const handleInputChange = (key: "pickup" | "drop", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], address: value },
    }));
  };

  const handleSelectLocation = (key: "pickup" | "drop", item: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: {
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
      },
    }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseTimeDetails = (timeString: string) => {
    let formattedTime = timeString || "12:00";
    let amOrPm: "AM" | "PM" = "AM";

    if (timeString) {
      const [hoursStr, minutesStr] = timeString.split(":");
      let hours = parseInt(hoursStr, 10);
      amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; 
      formattedTime = `${hours}:${minutesStr}`;
    }

    return { formattedTime, amOrPm };
  };

  const handleSubmit = async () => {
    const pickupTimeDetails = parseTimeDetails(form.pickupTime);
    const returnTimeDetails = parseTimeDetails(form.returnTime);

    let userPhone = "9901030543";
    try {
      const storedUser = localStorage.getItem("RydBazzarUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.mobile) userPhone = parsed.mobile;
      }
    } catch (e) {
      console.error("Failed parsing cached user credentials:", e);
    }

    const payload = {
      phoneNumber: userPhone,
      role: "CUSTOMER" as const,
      fromLocation: form.pickup.address,
      fromLatitude: form.pickup.latitude || 0,
      fromLongitude: form.pickup.longitude || 0,
      toLocation: form.drop.address,
      toLatitude: form.drop.latitude || 0,
      toLongitude: form.drop.longitude || 0,
      
      pickupDate: form.pickupDate, 
      pickupTime: pickupTimeDetails.formattedTime, 
      amOrPm: pickupTimeDetails.amOrPm, 
      
      returnDate: form.returnDate, 
      returnTime: returnTimeDetails.formattedTime,
      returnAmOrPm: returnTimeDetails.amOrPm,
      
      intermediateStops: [], 
      tripType: "ROUND_TRIP" as const 
    };

    console.log("Submitting API Payload:", payload);

    try {
      const resData = await getBestPrice(payload).unwrap();
      sessionStorage.setItem("currentTripQuote", JSON.stringify(resData));
      router.push("/trip");
    } catch (error) {
      console.error("Fare Quote Calculation failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pickup Location */}
      <LocationInput
        label="Pickup Location"
        value={form.pickup.address}
        placeholder="Enter pickup location"
        dotColor="green"
        onChangeInput={(val) => handleInputChange("pickup", val)}
        onSelectSuggestion={(item) => handleSelectLocation("pickup", item)}
      />

      {/* Drop Location */}
      <LocationInput
        label="Drop Location"
        value={form.drop.address}
        placeholder="Enter drop location"
        dotColor="red"
        onChangeInput={(val) => handleInputChange("drop", val)}
        onSelectSuggestion={(item) => handleSelectLocation("drop", item)}
      />

      {/* Pickup Date & Time Row */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Pickup Date & Time</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative flex items-center">
            <input
              type="date"
              value={form.pickupDate}
              onChange={(e) => handleFieldChange("pickupDate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Calendar size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>

          <div className="relative flex items-center">
            <input
              type="time"
              value={form.pickupTime}
              onChange={(e) => handleFieldChange("pickupTime", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Clock size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>
        </div>
      </div>

      {/* Return Date & Time Row */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Return Date & Time</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative flex items-center">
            <input
              type="date"
              min={form.pickupDate}
              value={form.returnDate}
              onChange={(e) => handleFieldChange("returnDate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Calendar size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>

          <div className="relative flex items-center">
            <input
              type="time"
              value={form.returnTime}
              onChange={(e) => handleFieldChange("returnTime", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Clock size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>
        </div>
      </div>

      {/* Vehicle selection */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Vehicle Type</label>
        <div className="relative flex items-center">
          <select
            value={form.vehicle}
            onChange={(e) => handleFieldChange("vehicle", e.target.value)}
            className="w-full border border-gray-200 rounded-lg py-3 px-3.5 pr-10 text-sm text-gray-700 appearance-none bg-transparent outline-none focus:border-gray-400 cursor-pointer"
          >
            <option value="" disabled hidden>
              Select vehicle type
            </option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="HATCHBACK">Hatchback</option>
          </select>
          <ChevronDown className="absolute right-3.5 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#facc15] hover:bg-[#eab308] text-gray-900 py-3.5 rounded-xl font-bold text-base transition-colors flex justify-center items-center gap-2 shadow-sm mt-2"
      >
        {isLoading && <Loader2 size={18} className="animate-spin text-gray-900" />}
        Find My Cab
      </button>
    </div>
  );
};

export default RoundTripForm;