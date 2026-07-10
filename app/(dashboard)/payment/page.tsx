import type { Metadata } from "next";
import PaymentContent from "./component/PaymentContent";


export const metadata: Metadata = {
  title: "Ryd-Bazzar | Payment",
};

export default function DashboardPage() {
  return <PaymentContent />;
}