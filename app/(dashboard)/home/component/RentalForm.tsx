"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  ShieldCheck,
  Plus,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLazyGetLocationSuggestionsQuery } from "@/app/store/api/homeApi"; 
import { useGetRentalFareQuoteMutation } from "@/app/store/api/rentalApi";

interface StopLocation {
  location: string;
  latitude: number | null;
  longitude: number | null;
  state: string;
}

interface LocationInputProps {
  label: string;
  value: string;
  placeholder: string;
  dotColor?: "green" | "yellow";
  onChangeInput: (val: string) => void;
  onSelectSuggestion: (item: any) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

const LocationInput = ({ 
  label, 
  value, 
  placeholder, 
  dotColor = "green",
  onChangeInput, 
  onSelectSuggestion,
  onRemove,
  showRemove = false
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
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-gray-800">{label}</label>
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>
      <div className="relative flex items-center">
        {/* Status Dot Accent */}
        <span
          className={`absolute left-3.5 w-2.5 h-2.5 rounded-full z-10 ${
            dotColor === "green" ? "bg-emerald-500" : "bg-amber-500"
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

  const [form, setForm] = useState<{
    pickup: StopLocation;
    intermediateStops: StopLocation[];
    date: string;
    time: string;
  }>({
    pickup: { location: "", latitude: null, longitude: null, state: "" },
    intermediateStops: [],
    date: "",
    time: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pickup Handlers
  const handleInputChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      pickup: { ...prev.pickup, location: value },
    }));
  };

  const handleSelectLocation = (item: any) => {
    setForm((prev) => ({
      ...prev,
      pickup: {
        location: item.address || item.placeName || "",
        latitude: item.latitude || null,
        longitude: item.longitude || null,
        state: item.state || "",
      },
    }));
  };

  // Intermediate Stops Handlers
  const handleAddStop = () => {
    setForm((prev) => ({
      ...prev,
      intermediateStops: [
        ...prev.intermediateStops,
        { location: "", latitude: null, longitude: null, state: "" },
      ],
    }));
  };

  const handleRemoveStop = (index: number) => {
    setForm((prev) => ({
      ...prev,
      intermediateStops: prev.intermediateStops.filter((_, i) => i !== index),
    }));
  };

  const handleIntermediateInputChange = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.intermediateStops];
      updated[index] = { ...updated[index], location: value };
      return { ...prev, intermediateStops: updated };
    });
  };

  const handleIntermediateSelectLocation = (index: number, item: any) => {
    setForm((prev) => {
      const updated = [...prev.intermediateStops];
      updated[index] = {
        location: item.address || item.placeName || "",
        latitude: item.latitude || null,
        longitude: item.longitude || null,
        state: item.state || "",
      };
      return { ...prev, intermediateStops: updated };
    });
  };

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!form.pickup.location) {
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

    // Format intermediateStops to match backend schema
    const formattedStops = form.intermediateStops
      .filter((stop) => stop.location.trim() !== "")
      .map((stop, index) => ({
        order: index + 1,
        location: stop.location,
        latitude: stop.latitude || 0,
        longitude: stop.longitude || 0,
        state: stop.state || "",
      }));

    const payload = {
      phoneNumber: userPhone,
      role: "CUSTOMER",
      fromLocation: form.pickup.location,
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
      intermediateStops: formattedStops,
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
        value={form.pickup.location}
        placeholder="Enter pickup location for rental"
        dotColor="green"
        onChangeInput={handleInputChange}
        onSelectSuggestion={handleSelectLocation}
      />

      {/* Intermediate Stops */}
      {form.intermediateStops.map((stop, index) => (
        <LocationInput
          key={index}
          label={`Stop ${index + 1}`}
          value={stop.location}
          placeholder="Enter stop location"
          dotColor="yellow"
          showRemove={true}
          onRemove={() => handleRemoveStop(index)}
          onChangeInput={(val) => handleIntermediateInputChange(index, val)}
          onSelectSuggestion={(item) => handleIntermediateSelectLocation(index, item)}
        />
      ))}

      {/* Add Stop Button */}
      <button
        type="button"
        onClick={handleAddStop}
        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 py-1"
      >
        <Plus size={16} /> Add Intermediate Stop
      </button>

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
          </div>

          <div className="relative flex items-center">
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleFieldChange("time", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-3 px-3.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors bg-white"
            />
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