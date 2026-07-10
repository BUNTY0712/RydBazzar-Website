import type { Metadata } from "next";


import CurrentBookingContent from "./component/CurrentBookingContent";


export const metadata: Metadata = {
  title: "Ryd-Bazzar | Current Booking",
};

export default function DashboardPage() {
  return <CurrentBookingContent />;
}