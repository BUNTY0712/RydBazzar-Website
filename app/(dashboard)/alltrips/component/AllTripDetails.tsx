import React from 'react';
import { Star, Car, Wallet, FileDown } from 'lucide-react';
import { useRouter } from "next/navigation"
interface TripItem {
  id: number;
  date: string;
  time: string;
  status: 'Completed' | 'Cancelled' | 'Upcoming';
  pickup: string;
  destination: string;
  driverName: string;
  driverRating: string;
  driverImage: string;
  carModel: string;
  plateNumber: string;
  fare: string;
  paymentMethod: string;
}

const mockTrips: TripItem[] = [
  {
    id: 1,
    date: "22 Jun 2026",
    time: "04:43 PM",
    status: "Completed",
    pickup: "Sector V, Salt Lake City",
    destination: "Netaji Subhash Chandra Bose Int'l Airport",
    driverName: "Rohit Sharma",
    driverRating: "4.8",
    driverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    carModel: "Toyota Etios",
    plateNumber: "WB 12 CD 5678",
    fare: "82.32",
    paymentMethod: "Digital Wallet"
  },
  {
    id: 2,
    date: "23 Jun 2026",
    time: "04:43 PM",
    status: "Completed",
    pickup: "Sector V, Salt Lake City",
    destination: "Netaji Subhash Chandra Bose Int'l Airport",
    driverName: "Jatin Sharma",
    driverRating: "4.8",
    driverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    carModel: "Toyota Etios",
    plateNumber: "WB 12 CD 5678",
    fare: "602.32",
    paymentMethod: "Digital Wallet"
  }
];

const AllTripDetails = () => {
    const router = useRouter()
  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans text-slate-800 space-y-6">
      {mockTrips.map((trip) => (
        <div 
          key={trip.id}

          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl shadow-slate-100/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative overflow-hidden"
        >

          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Trip Date</p>
              <h3 className="text-base font-black text-slate-900 mt-0.5 tracking-tight">{trip.date}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{trip.time}</p>
            </div>
            
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/50 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {trip.status}
              </span>
            </div>
          </div>


          <div className="md:col-span-4 flex gap-4 relative">

            <div className="flex flex-col items-center justify-between py-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="w-[2px] flex-1 my-1 bg-gradient-to-b from-emerald-400 via-amber-400 to-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>


            <div className="flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pickup</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug">
                  {trip.pickup}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Destination</p>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug">
                  {trip.destination}
                </p>
              </div>
            </div>
          </div>


          <div className="hidden md:block w-[1px] bg-slate-100 my-1 mx-auto" />


          <div className="md:col-span-3 flex items-start gap-4 pt-1">
            <img 
              src={trip.driverImage} 
              alt={trip.driverName} 
              className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-100 border border-slate-100"
            />
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-black text-slate-900">{trip.driverName}</h4>
                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                  <span>{trip.driverRating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Car className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                <span>{trip.carModel}</span>
              </div>

              <div className="inline-block bg-blue-50/70 text-[#0c1e36] text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded border border-blue-100/40 mt-1">
                {trip.plateNumber}
              </div>
            </div>
          </div>

          
          <div className="md:col-span-2 flex flex-col md:items-end justify-between text-left md:text-right space-y-4 md:space-y-0">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Trip Fare</p>
              <h2 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
                ₹{trip.fare}
              </h2>
              <div className="flex md:justify-end items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                <Wallet className="w-3 h-3 text-slate-400" />
                <span>{trip.paymentMethod}</span>
              </div>
            </div>

           <button  onClick={() => router.push("/currentbooking")} className="w-full md:w-50 bg-[#fbc843] hover:bg-[#e0b236] text-slate-900 font-black text-xs py-3 px-4 rounded-xl shadow-md shadow-amber-100/50 transition-colors flex items-center justify-center gap-1.5">
  <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
  Download Invoice
</button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AllTripDetails;