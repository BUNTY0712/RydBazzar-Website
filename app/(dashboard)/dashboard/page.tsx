import type { Metadata } from "next";
import DashboardContent from "../home/component/DashboardContent";


export const metadata: Metadata = {
  title: "Ryd-Bazzar Dashboard",
};

export default function DashboardPage() {
  return <DashboardContent />;
}