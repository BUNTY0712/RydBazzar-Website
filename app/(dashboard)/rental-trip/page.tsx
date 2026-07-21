import type { Metadata } from "next";
import RentalTripContent from "./component/RentalTripContent";




export const metadata: Metadata = {
  title: "Ryd-Bazzar | Rental-Trip",
};

export default function DashboardPage() {
  return <RentalTripContent />;
}