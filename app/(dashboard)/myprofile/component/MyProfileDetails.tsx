import React from 'react';
import { 
  User, 
  Wallet, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Pencil, 
  BarChart3, 
  Phone, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useRouter } from "next/navigation"

const MyProfileDetails = () => {
      const router = useRouter()
  const navigationItems = [
    {
      icon: <User className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      title: "Personal Information",
      description: "Update your personal details and ID verification",
      actionColor: "text-slate-800"
    },
    {
      icon: <Wallet className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      title: "My Wallet",
      description: "View wallet balance, add money, and view history",
      actionColor: "text-slate-800"
    },
    {
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      title: "Notifications",
      description: "Manage your notification preferences and alerts",
      actionColor: "text-slate-800"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      title: "Privacy Policy",
      description: "Read our privacy terms and data management rules",
      actionColor: "text-slate-800"
    },
    {
      icon: <LogOut className="w-5 h-5 text-red-600" />,
      bgIcon: "bg-red-50",
      title: "Logout",
      description: "Sign out of your RydBazzar account securely",
      actionColor: "text-red-600"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 font-sans text-slate-800 bg-slate-50/30 min-h-screen">
      

      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0c1e36] tracking-tight">My Profile</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">View your current, upcoming and completed rides.</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        

        <div className="lg:col-span-8 space-y-4">
          

          <div className="w-full bg-gradient-to-r from-[#fcd34d] via-[#fbc843] to-[#f59e0b] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-md relative overflow-hidden">
            

            <div className="relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" 
                alt="Soumen Sarkar" 
                className="w-24 h-24 rounded-full border-4 border-white/60 object-cover shadow-md"
              />
              <button className="absolute bottom-0 right-1 bg-black text-white p-1.5 rounded-full shadow-md hover:bg-slate-900 transition-colors border border-white/20">
                <Pencil className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>


            <div className="flex-1 text-center sm:text-left space-y-4 w-full">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Soumen Sarkar</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold text-slate-800 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 opacity-80" /> Member Since 15 Jan 2024
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-black border border-white/10">
                    <CheckCircle2 className="w-3 h-3 text-slate-900 fill-transparent" /> Verified User
                  </span>
                </div>
              </div>


              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <span>Wallet Balance:</span>
                  <span className="text-[#fbc843]">₹2500</span>
                </div>
                
                <button  onClick={() => router.push("/mywallet")} className="bg-white/40 hover:bg-white/60 text-slate-900 text-xs font-black px-5 py-2.5 rounded-xl transition-colors border border-white/20">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>


          <div className="space-y-3 pt-2">
            {navigationItems.map((item, index) => (
              <div 
                key={index}
                className="w-full bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200/60 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${item.bgIcon} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black ${item.actionColor} tracking-tight`}>
                      {item.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5 leading-none">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </div>
            ))}
          </div>

        </div>


        <div className="lg:col-span-4 space-y-4">
          

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold tracking-wide text-slate-400 uppercase">Account Summary</h3>
            </div>


            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50/40 border border-blue-100/10 rounded-xl p-3">
                <span className="text-[11px] font-bold text-slate-400">Total Trips</span>
                <p className="text-base font-black text-slate-900 mt-1">24</p>
              </div>
              <div className="bg-blue-50/40 border border-blue-100/10 rounded-xl p-3">
                <span className="text-[11px] font-bold text-slate-400">Completed</span>
                <p className="text-base font-black text-slate-900 mt-1">22</p>
              </div>
            </div>


            <div className="space-y-3.5 pt-1 text-xs font-bold text-slate-500">
              <div className="flex items-center justify-between">
                <span>Phone Number</span>
                <span className="text-slate-900 font-extrabold">+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email ID</span>
                <span className="text-slate-900 font-extrabold truncate max-w-[180px]">soumen@example.com</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span>Status</span>
                <span className="bg-emerald-50 text-emerald-600 font-black text-[10px] tracking-wider px-2 py-0.5 rounded-md uppercase">
                  Active
                </span>
              </div>
            </div>
          </div>


          <div className="bg-[#0c1e36] text-white border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl shadow-slate-200/20">
            <div>
              <h4 className="text-sm font-extrabold text-[#fbc843]">Need Help?</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 leading-relaxed">
                Our support team is available 24/7 to assist you with your rides.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button className="w-full bg-slate-800/60 hover:bg-slate-800/90 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700/40">
                <Phone className="w-4 h-4 text-slate-300" />
                Call Support
              </button>
              
              <button className="w-full bg-slate-800/60 hover:bg-slate-800/90 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700/40">
                <MessageSquare className="w-4 h-4 text-slate-300" />
                WhatsApp Support
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyProfileDetails;