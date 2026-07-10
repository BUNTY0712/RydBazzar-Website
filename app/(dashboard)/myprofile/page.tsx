import type { Metadata } from "next";
import MyProfileContent from "./component/MyProfileContent";

export const metadata: Metadata = {
  title: "Ryd-Bazzar | My Profile",
};

export default function DashboardPage() {
  return <MyProfileContent />;
}