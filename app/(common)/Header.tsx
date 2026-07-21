import React from 'react'
import Image from 'next/image' // 1. Import Next.js Image component
import logo from "../../app/src/assets/Image/logo.png"
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
  return (
    <header className="bg-[#1a2333] text-white px-6 py-4 flex items-center justify-between font-sans">
      {/* Left Section: Logo */}
      <div onClick={()=>   router.push("/dashboard")}  className="flex items-center gap-2">
        {/* 2. Use <Image> and remove manual height/width if you want it to use the image's intrinsic size, or style it directly */}
        <Image src={logo} alt="RydBazzar Logo" className="h-8 w-auto" priority />
      </div>

      {/* Center Section: Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="/dashboard" className="hover:text-white transition-colors">Home</a>
        <a href="/alltrips" className="hover:text-white transition-colors">All Trips</a>
        <a href="#about" className="hover:text-white transition-colors">About us</a>
      </nav>

      {/* Right Section: Call to Action Button */}
      <div>
        <button className="bg-[#fbc843] hover:bg-[#e0b236] text-black font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md">
          Download App
        </button>
      </div>
    </header>
  )
}

export default Header