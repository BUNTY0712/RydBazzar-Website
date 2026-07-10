import React from 'react';
import { ShieldAlert, IndianRupee, UserCheck, PhoneCall } from 'lucide-react';

const FeatureBanner = () => {
  const features = [
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#fbc843]" />,
      title: "Safe & Secure",
      description: "Your safety is our priority",
    },
    {
      icon: <IndianRupee className="w-5 h-5 text-[#fbc843]" />,
      title: "Lowest Prices",
      description: "Best prices, always",
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#fbc843]" />,
      title: "Verified Drivers",
      description: "Background verified",
    },
    {
      icon: <PhoneCall className="w-5 h-5 text-[#fbc843]" />,
      title: "24×7 Support",
      description: "We are here anytime",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans">
      <div className="w-full bg-[#0c1e36] rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {features.map((item, index) => (
          <div key={index} className="flex items-center gap-4 px-2">

            <div className="w-12 h-12 rounded-full bg-slate-800/40 border border-slate-700/30 flex items-center justify-center shrink-0 shadow-inner">
              {item.icon}
            </div>
            

            <div className="flex flex-col">
              <h4 className="text-sm font-extrabold text-white tracking-wide">
                {item.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-normal">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureBanner;