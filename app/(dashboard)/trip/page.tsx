import type { Metadata } from "next";

import TripContent from "./component/TripContent";


export const metadata: Metadata = {
  title: "Ryd-Bazzar | Trip",
};

export default function DashboardPage() {
  return <TripContent />;
}