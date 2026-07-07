"use client"

import React from 'react'
import Header from '@/app/(common)/Header' // Adjust the import path according to your exact file structure if needed
import Footer from '../(common)/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#fff]">
      {/* Integrated Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 p-0 overflow-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}