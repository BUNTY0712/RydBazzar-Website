import type { Metadata } from "next";
import MyWalletContent from "./component/MyWalletContent";

export const metadata: Metadata = {
  title: "Ryd-Bazzar | My Wallet",
};

export default function DashboardPage() {
  return <MyWalletContent />;
}