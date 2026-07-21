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

const OneWayForm = () => {
  const router = useRouter();
  const [getBestPrice, { isLoading }] = useGetBestPriceWithoutTollMutation();

  const [form, setForm] = useState({
    pickup: { address: "", latitude: null as number | null, longitude: null as number | null },
    drop: { address: "", latitude: null as number | null, longitude: null as number | null },
    date: "",
    time: "",
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

  const handleSubmit = async () => {
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
        if (parsed.mobile) {
          userPhone = parsed.mobile;
        }
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
      pickupDate: form.date, 
      pickupTime: formattedTime, 
      amOrPm: amOrPm as "AM" | "PM",
      returnDate: "string", 
      returnTime: "6:00",
      returnAmOrPm: "PM" as const,
      intermediateStops: [], 
      tripType: "ONE_WAY" as const
    };

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

      {/* Date & Time */}
      <div>
        <label className="text-sm font-bold text-gray-800 block mb-2">Date & Time</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative flex items-center">
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Calendar size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>

          <div className="relative flex items-center">
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleFieldChange("time", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
            {/* <Clock size={18} className="absolute right-3.5 text-gray-400 pointer-events-none" /> */}
          </div>
        </div>
      </div>

      {/* Vehicle Type */}
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

      {/* Action Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#facc15] hover:bg-[#eab308] text-gray-900 py-3.5 rounded-xl font-bold text-base transition-colors flex justify-center items-center gap-2 shadow-sm mt-2"
      >
        {isLoading && <Loader2 size={18} className="animate-spin text-gray-900" />}
        Find My cab
      </button>
    </div>
  );
};

export default OneWayForm;