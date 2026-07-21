'use client';
import React, { useEffect, useState } from 'react'
import PaymentSummary from './PaymentSummary'
import FeatureBanner from './FeatureBanner'

const PaymentContent = () => {
    const [tripData, setTripData] = useState<any>(null);
      useEffect(() => {
        const cachedData = sessionStorage.getItem("currentTripQuote");
        if (cachedData) {
          setTripData(JSON.parse(cachedData));
        }
      }, []);
  return (
    <>
    <PaymentSummary data={tripData}/>
    <FeatureBanner/>
    </>
      

  )
}

export default PaymentContent
