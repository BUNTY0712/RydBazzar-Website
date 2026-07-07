import { redirect } from "next/navigation"

export default function Page() {
 
  const isLoggedIn = false // 🔥 replace with real auth later

  if (true) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}