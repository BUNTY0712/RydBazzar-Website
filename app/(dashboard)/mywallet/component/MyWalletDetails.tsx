import React, { useState } from 'react';
import { 
  Plus, 
  Receipt, 
  Search, 
  SlidersHorizontal, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCcw, 
  Car, 
  BarChart3, 
  Phone, 
  MessageSquare,
  Award,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: number;
  type: 'Added' | 'Used' | 'Refund';
  title: string;
  date: string;
  time: string;
  amount: string;
  statusLabel: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'Added',
    title: 'Money Added',
    date: '2 Jul 2024',
    time: '06:30 PM',
    amount: '+₹500.00',
    statusLabel: 'Added'
  },
  {
    id: 2,
    type: 'Used',
    title: 'Ride Payment to Rohit Sharma',
    date: '2 Jul 2024',
    time: '06:31 PM',
    amount: '-₹245.49',
    statusLabel: 'Used'
  },
  {
    id: 3,
    type: 'Added',
    title: 'Money Added',
    date: '30 Jun 2024',
    time: '08:15 PM',
    amount: '+₹1,000.00',
    statusLabel: 'Added'
  },
  {
    id: 4,
    type: 'Used',
    title: 'Ride Payment to Rahul Verma',
    date: '29 Jun 2024',
    time: '09:10 PM',
    amount: '-₹189.00',
    statusLabel: 'Used'
  },
  {
    id: 5,
    type: 'Refund',
    title: 'Refund from Cancelled Ride',
    date: '28 Jun 2024',
    time: '11:45 AM',
    amount: '+₹120.00',
    statusLabel: 'Refund'
  }
];

const MyWalletDetails = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = ['All', 'Added', 'Ride Payments', 'Refunds', 'Withdrawals'];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 font-sans text-slate-800 bg-slate-50/30 min-h-screen">
      

      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0c1e36] tracking-tight">My Wallet</h1>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">View your current, upcoming and completed rides.</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        

        <div className="lg:col-span-8 space-y-6">
          

          <div className="w-full bg-gradient-to-r from-[#fcd34d] via-[#fbc843] to-[#f59e0b] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            

            <div className="space-y-3 text-center sm:text-left">
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-amber-950/60">Total Balance</p>
                <p className="text-3xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5 font-extrabold ">
                  Reference: ₹2,500.00
                </p>
              </div>
              

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <span className="inline-flex items-center gap-1 bg-black/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-950">
                  <Award className="w-3.5 h-3.5" /> 1,244 Pts
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-950">
                  <Wallet className="w-3.5 h-3.5" /> ₹150.00 Cashback
                </span>
              </div>
            </div>


            <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
              <button className="w-full sm:w-44 bg-[#0c1e36] hover:bg-[#081424] text-white text-xs font-black py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" /> Withdrawal
              </button>
              <button className="w-full sm:w-44 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors border border-slate-100">
                <Receipt className="w-4 h-4 text-slate-700" /> Transaction
              </button>
            </div>
          </div>


          <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-100/40 space-y-5">
            

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50/50 flex items-center justify-center text-[#0c1e36]">
                  <Receipt className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Transactions</h3>
              </div>


              <div className="flex items-center gap-2">
                <div className="relative flex items-center flex-1 sm:w-60">
                  <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..." 
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-100 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-slate-300 text-slate-800 transition-colors"
                  />
                </div>
                <button className="p-2 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                  <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>


            <div className="flex flex-wrap gap-2 border-b border-slate-50 pb-2 overflow-x-auto scrollbar-none">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#0c1e36] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>


            <div className="divide-y divide-slate-50/80">
              {mockTransactions.map((tx) => {
                const isAddition = tx.type === 'Added' || tx.type === 'Refund';
                
                return (
                  <div key={tx.id} className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1">
                    <div className="flex items-center gap-4">
                      

                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'Added' ? 'bg-emerald-50 text-emerald-600' :
                        tx.type === 'Refund' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {tx.type === 'Added' && <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />}
                        {tx.type === 'Refund' && <RotateCcw className="w-4 h-4 stroke-[2.5]" />}
                        {tx.type === 'Used' && <Car className="w-4 h-4 stroke-[2.2]" />}
                      </div>


                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                          {tx.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1">
                          {tx.date} • {tx.time}
                        </p>
                      </div>
                    </div>


                    <div className="flex items-center gap-4 text-right">
                      <span className={`inline-block font-black text-[10px] uppercase px-2 py-0.5 rounded-md border ${
                        tx.type === 'Added' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' :
                        tx.type === 'Refund' ? 'bg-blue-50/50 border-blue-100 text-blue-600' : 'bg-orange-50/50 border-orange-100 text-orange-600'
                      }`}>
                        {tx.statusLabel}
                      </span>
                      <span className={`text-sm md:text-base font-black tracking-tight font-bold ${
                        isAddition ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.amount}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>


            <div className="pt-2 flex justify-center">
              <button className="border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2.5 px-6 rounded-xl transition-colors text-slate-700 shadow-sm">
                View All Transactions
              </button>
            </div>

          </div>
        </div>


        <div className="lg:col-span-4 space-y-4">
          

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-slate-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold tracking-wide text-slate-400 uppercase">Account Summary</h3>
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
                <span className="text-slate-900 font-bold">+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email ID</span>
                <span className="text-slate-900 font-bold truncate max-w-[180px]">soumen@example.com</span>
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
              <h4 className="text-sm font-bold text-[#fbc843]">Need Help?</h4>
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

export default MyWalletDetails;