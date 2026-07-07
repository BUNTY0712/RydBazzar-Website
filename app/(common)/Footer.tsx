import React from 'react'
import Image from 'next/image'
import footerBg from '../../app/src/assets/Image/footerBg.png'
import logo from "../../app/src/assets/Image/logo.png"
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer 
      className="w-full text-white bg-cover bg-center bg-no-repeat relative pt-16 font-sans"
      style={{ backgroundImage: `url(${footerBg.src})`, backgroundColor: '#1a2333' }}
    >
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Column 1: Brand Info & Newsletter */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="RydBazzar Logo" className="h-8 w-auto" />
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
            Receive our latest updates about our products & promotions.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-3 pt-2 max-w-sm">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg text-sm focus:outline-none placeholder-gray-400"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-[#fbc843] hover:bg-[#e0b236] text-[#1a2333] font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2 lg:col-start-6 flex flex-col space-y-4">
          <p className="font-bold text-base tracking-wide text-white">Quick Links</p>
          <ul className="space-y-2.5 text-gray-400 text-sm font-medium">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy policy</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors">Terms & condition</a></li>
          </ul>
        </div>

        {/* Column 3: Services Links */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <p className="font-bold text-base tracking-wide text-white">Services</p>
          <ul className="space-y-2.5 text-gray-400 text-sm font-medium">
            <li><a href="#city-rides" className="hover:text-white transition-colors">City Rides</a></li>
            <li><a href="#airport" className="hover:text-white transition-colors">Airport Transfer</a></li>
            <li><a href="#outstation" className="hover:text-white transition-colors">Outstation Trips</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#hourly" className="hover:text-white transition-colors">Hourly Rental</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <p className="font-bold text-base tracking-wide text-white">Contact Us</p>
          <div className="space-y-3 text-gray-400 text-sm font-medium">
            <p className="leading-relaxed">
              768 Market Street<br />
              kolkata , 70071 ,<br />
              west bengal
            </p>
            <p><a href="mailto:customer@rydbazzar.com" className="hover:text-white transition-colors">customer@rydbazzar.com</a></p>
            <p><a href="tel:+6291557796" className="hover:text-white transition-colors">+6291557796</a></p>
          </div>

          {/* Social Icons Tray */}
          <div className="flex items-center gap-3 pt-2">
            <a href="#fb" className="w-8 h-8 rounded-full bg-white text-[#1a2333] flex items-center justify-center hover:bg-[#fbc843] transition-colors">
              <Facebook className="w-4 h-4 fill-current stroke-none" />
            </a>
            <a href="#tw" className="w-8 h-8 rounded-full bg-white text-[#1a2333] flex items-center justify-center hover:bg-[#fbc843] transition-colors">
              <Twitter className="w-4 h-4 fill-current stroke-none" />
            </a>
            <a href="#ig" className="w-8 h-8 rounded-full bg-white text-[#1a2333] flex items-center justify-center hover:bg-[#fbc843] transition-colors">
              <Instagram className="w-4 h-4" size={16} strokeWidth={2.5} />
            </a>
            <a href="#yt" className="w-8 h-8 rounded-full bg-white text-[#1a2333] flex items-center justify-center hover:bg-[#fbc843] transition-colors">
              <Youtube className="w-4 h-4 fill-current stroke-none" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal Copyright Strip */}
      <div className="w-full border-t border-gray-800/60 py-6 text-center text-sm font-bold text-gray-400/80">
        <p>© 2026 Copyright by RydBazzar</p>
      </div>
    </footer>
  )
}

export default Footer