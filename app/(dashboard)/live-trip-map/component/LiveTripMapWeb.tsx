"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline, 
  useMap,
  useMapEvents 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  ArrowLeft, 
  Clock, 
  Gauge, 
  Car, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { isTripInProgress, reconnectDelay, shouldReconnect, WS_BANNER_DELAY_MS } from '../helper/liveTripHelpers';

// import { 
//   reconnectDelay, 
//   shouldReconnect, 
//   isTripInProgress, 
//   WS_BANNER_DELAY_MS 
// } from './liveTripHelpers';

// Base WebSocket / HTTP server host (matching React Native AppConfig)
const SERVER_HOST = '13.204.247.177:9090';

// Custom Marker Icons
const driverIcon = (heading: number = 0) => new L.DivIcon({
  className: 'custom-driver-icon',
  html: `
    <div style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
      <div style="
        width: 42px; 
        height: 42px; 
        border-radius: 21px; 
        border: 2px solid #FFFFFF; 
        background-color: #111111; 
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=120&auto=format&fit=crop" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const userIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: `
    <div style="width: 22px; height: 22px; border-radius: 11px; background-color: rgba(33, 150, 243, 0.2); display: flex; align-items: center; justify-content: center;">
      <div style="width: 12px; height: 12px; border-radius: 6px; background-color: #2196F3; border: 2px solid #FFFFFF;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const pickupIcon = new L.DivIcon({
  className: 'custom-pickup-icon',
  html: `
    <div style="width: 22px; height: 22px; border-radius: 11px; background-color: rgba(235, 87, 87, 0.2); display: flex; align-items: center; justify-content: center;">
      <div style="width: 12px; height: 12px; border-radius: 6px; background-color: #EB5757; border: 2px solid #FFFFFF;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface LocationUpdateResponse {
  type: "LOCATION_UPDATE";
  bookingId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speedKmh: number;
  updatedAt: string;
  etaMinutes: number;
  status: string;
  message: string | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface LiveTripWebProps {
  bookingId: string;
  token: string;
  pickupLocation?: { latitude: number; longitude: number };
  onBack?: () => void;
}

// Controller component to detect user interaction and auto-sync map camera
const MapController = ({ 
  driverCoords, 
  pickupCoords, 
  userCoords, 
  isUserInteracting, 
  setIsUserInteracting,
  tripStarted 
}: any) => {
  const map = useMap();

  useMapEvents({
    dragstart: () => setIsUserInteracting(true),
    zoomstart: () => setIsUserInteracting(true),
  });

  useEffect(() => {
    if (isUserInteracting) return;

    const points: L.LatLngExpression[] = [];

    if (driverCoords?.latitude) {
      points.push([driverCoords.latitude, driverCoords.longitude]);
    }
    if (pickupCoords?.latitude && pickupCoords?.latitude !== 0 && !tripStarted) {
      points.push([pickupCoords.latitude, pickupCoords.longitude]);
    }
    if (tripStarted && userCoords?.latitude) {
      points.push([userCoords.latitude, userCoords.longitude]);
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [80, 80], animate: true });
    }
  }, [driverCoords, pickupCoords, userCoords, isUserInteracting, tripStarted, map]);

  return null;
};

export const LiveTripMapWeb: React.FC<LiveTripWebProps> = ({
  bookingId,
  token,
  pickupLocation = { latitude: 23.7294, longitude: 86.3775 },
  onBack,
}) => {
  const [locationData, setLocationData] = useState<LocationUpdateResponse | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);

  // 1. Fetch User's Current Browser Location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => console.warn('Browser geolocation error:', err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }, []);

  // 2. WebSocket Implementation with identical RN retry and banner logic
  useEffect(() => {
    if (!bookingId || !token) {
      setError('Missing trip details or authentication token.');
      setLoading(false);
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${SERVER_HOST}/ws/trips/${encodeURIComponent(bookingId)}?token=${token}`;

    let ws: WebSocket | null = null;
    let retryTimer: NodeJS.Timeout | null = null;
    let bannerTimer: NodeJS.Timeout | null = null;
    let attempts = 0;
    let stopped = false;

    const scheduleBanner = () => {
      if (bannerTimer) return;
      bannerTimer = setTimeout(() => {
        if (!stopped) {
          setError('Reconnecting…');
          setLoading(false);
        }
      }, WS_BANNER_DELAY_MS);
    };

    const clearBanner = () => {
      if (bannerTimer) {
        clearTimeout(bannerTimer);
        bannerTimer = null;
      }
      setError(null);
    };

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        attempts = 0;
        clearBanner();
        setLoading(false);
      };

      ws.onmessage = (e) => {
        try {
          const response: LocationUpdateResponse = JSON.parse(e.data);
          if (response.type === "LOCATION_UPDATE") {
            setLocationData(response);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket Error:', e);
      };

      ws.onclose = () => {
        if (stopped) return;
        if (shouldReconnect(attempts, stopped)) {
          attempts += 1;
          const delay = reconnectDelay(attempts);
          console.log(`WebSocket closed, reconnecting in ${delay}ms (attempt ${attempts})`);
          scheduleBanner();
          retryTimer = setTimeout(connect, delay);
        }
      };
    };

    const reconnectNow = () => {
      if (stopped) return;
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      attempts = 0;
      if (retryTimer) clearTimeout(retryTimer);
      connect();
    };

    // Listen for web online and window focus events
    window.addEventListener('online', reconnectNow);
    window.addEventListener('focus', reconnectNow);

    connect();

    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (bannerTimer) clearTimeout(bannerTimer);
      window.removeEventListener('online', reconnectNow);
      window.removeEventListener('focus', reconnectNow);
      ws?.close();
    };
  }, [bookingId, token]);

  const tripStarted = isTripInProgress(locationData?.status);

  const initialCenter: [number, number] = [
    pickupLocation.latitude || locationData?.latitude || userLocation?.latitude || 23.7294,
    pickupLocation.longitude || locationData?.longitude || userLocation?.longitude || 86.3775,
  ];

  return (
    <div className="relative w-full h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      
      {/* Map Layer */}
      <MapContainer
        center={initialCenter}
        zoom={14}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          driverCoords={locationData}
          pickupCoords={pickupLocation}
          userCoords={userLocation}
          isUserInteracting={isUserInteracting}
          setIsUserInteracting={setIsUserInteracting}
          tripStarted={tripStarted}
        />

        {/* Route to Pickup (Only before trip starts) */}
        {locationData && pickupLocation.latitude !== 0 && !tripStarted && (
          <Polyline
            positions={[
              [locationData.latitude, locationData.longitude],
              [pickupLocation.latitude, pickupLocation.longitude],
            ]}
            color="#2196F3"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}

        {/* Pickup Marker (Only before trip starts) */}
        {pickupLocation.latitude !== 0 && !tripStarted && (
          <Marker position={[pickupLocation.latitude, pickupLocation.longitude]} icon={pickupIcon} />
        )}

        {/* Driver Live Marker */}
        {locationData && (
          <Marker 
            position={[locationData.latitude, locationData.longitude]} 
            icon={driverIcon(locationData.heading)} 
          />
        )}

        {/* User Marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />
        )}
      </MapContainer>

      {/* Floating Back Header Button */}
      <button
        onClick={onBack}
        className="absolute top-[55px] left-5 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-all text-[#111111] font-bold text-lg"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Recenter Floating Button */}
      {isUserInteracting && (
        <button
          onClick={() => setIsUserInteracting(false)}
          className="absolute top-[55px] left-1/2 -translate-x-1/2 z-10 bg-[#111111] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-slate-800 transition-all text-xs font-semibold flex items-center gap-1.5"
        >
          📍 Recenter Route
        </button>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#111111] animate-spin" />
          <p className="text-sm font-semibold text-[#111111] tracking-wide">Locating your ride...</p>
        </div>
      )}

      {/* Error / Reconnecting Toast */}
      {error && !loading && (
        <div className="absolute top-[120px] left-5 right-5 z-20 max-w-md mx-auto bg-[#FEE2E2] text-[#DC2626] p-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Premium Bottom Details Card */}
      {locationData && !loading && (
        <div className="absolute bottom-0 inset-x-0 z-10 p-0 pointer-events-none">
          <div className="max-w-xl mx-auto bg-white rounded-t-[30px] shadow-2xl px-6 pt-3.5 pb-8 border border-slate-100 pointer-events-auto space-y-5">
            
            {/* Handlebar */}
            <div className="w-9 h-1 bg-[#E5E7EB] rounded-full mx-auto" />

            {/* Profile Grid */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img 
                  src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=400&auto=format&fit=crop"
                  alt="Vehicle Thumbnail"
                  className="w-[54px] h-[54px] rounded-2xl bg-[#F3F4F6] object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#111111] tracking-tight">
                    {locationData.etaMinutes} mins away
                  </h3>
                  <p className="text-xs font-medium text-[#6B7280] mt-0.5">
                    Booking ID: {locationData.bookingId.substring(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              <span className="bg-[#ECFDF5] text-[#059669] font-bold text-[11px] tracking-wider px-2.5 py-1.5 rounded-xl uppercase">
                {locationData.status.toUpperCase()}
              </span>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#F3F4F6] w-full" />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase font-bold text-[#9CA3AF] tracking-wider mb-1">Speed</p>
                <p className="text-sm font-semibold text-[#374151]">{locationData.speedKmh} km/h</p>
              </div>

              <div className="border-l border-[#F3F4F6] pl-6">
                <p className="text-[11px] uppercase font-bold text-[#9CA3AF] tracking-wider mb-1">Last Updated</p>
                <p className="text-sm font-semibold text-[#374151]">
                  {new Date(locationData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};