import type { Metadata } from "next";
import AllTripsContent from "./component/AllTripsContent";

export const metadata: Metadata = {
  title: "Ryd-Bazzar | All Trips",
};

export default function DashboardPage() {
  return <AllTripsContent />;
}