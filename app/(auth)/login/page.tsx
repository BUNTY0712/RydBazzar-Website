"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLoginMutation, useVerifyOtpMutation } from "@/app/store/api/authApi"
import { toast } from "sonner"
import logo from "../../src/assets/Image/logo.png"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form State
  const [mobile, setMobile] = useState("")
  const [role, setRole] = useState("CUSTOMER") 
  const [otp, setOtp] = useState("")
  
  // UI Flow State (false = enter mobile, true = verify OTP)
  const [isOtpStep, setIsOtpStep] = useState(false)

  // API mutations
  const [sendOtpRequest] = useLoginMutation()
  const [verifyOtpRequest] = useVerifyOtpMutation()

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    if (!mobile || mobile.length < 10) {
      toast.error("Please enter a valid mobile number")
      return
    }

    setIsLoading(true)
    try {
      const res = await sendOtpRequest({
        mobile: mobile,
        role: role,
      }).unwrap()

      toast.success(res?.message || "OTP sent successfully!")
      setIsOtpStep(true) 
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  // STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const res = await verifyOtpRequest({
        mobile: mobile,
        otp: otp,
        role: role,
      }).unwrap()

      console.log('res',res);

      // Save token
      if (res?.token) {
        localStorage.setItem("RydBazzarToken", res.token)
      } else if (res?.data?.token) {
        localStorage.setItem("RydBazzarToken", res.data.token)
      }

      // Optional: Save user data
      // if (res?.user) {
        localStorage.setItem("RydBazzarUser", JSON.stringify(res))
      // }

      toast.success(res?.message || "Login successful!")
      // console.log("res",res);
      // return;
      router.replace("/dashboard")
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action()
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#f4f7fa]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes cabMove    { 0% { transform: translateX(-100px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(360px); opacity: 0; } }
        @keyframes roadDash  { to { stroke-dashoffset: -40; } }
        @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gridScroll  { from { transform:translateY(0); } to { transform:translateY(-40px); } }
        @keyframes shimmer     { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes spinAnim    { to { transform: rotate(360deg); } }

        .cab-anim     { animation: cabMove 4.5s ease-in-out infinite; }
        .road-dash    { stroke-dasharray: 12 8; animation: roadDash .6s linear infinite; }
        .float-anim   { animation: floatCard 3.5s ease-in-out infinite; }
        .grid-scroll  { animation: gridScroll 4s linear infinite; }
        .fu1 { animation: fadeSlideUp .5s ease both .1s; opacity:0; }
        .fu2 { animation: fadeSlideUp .5s ease both .2s; opacity:0; }
        .fu3 { animation: fadeSlideUp .5s ease both .3s; opacity:0; }
        .fu4 { animation: fadeSlideUp .5s ease both .4s; opacity:0; }
        .fu5 { animation: fadeSlideUp .5s ease both .5s; opacity:0; }
        .fu6 { animation: fadeSlideUp .5s ease both .6s; opacity:0; }

        .vrm-input {
          width: 100%; padding: 13px 16px 13px 42px; border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,.08); font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #111; background: #fafafa;
          outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
          box-sizing: border-box;
        }
        .vrm-input:focus { border-color: #ffc815; background: #fff; box-shadow: 0 0 0 4px rgba(255,200,21,.15); }
        .vrm-input::placeholder { color: rgba(0,0,0,.3); }

        .vrm-select {
          width: 100%; padding: 13px 16px 13px 42px; border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,.08); font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #111; background: #fafafa;
          outline: none; cursor: pointer; appearance: none;
        }
        .vrm-select:focus { border-color: #ffc815; background: #fff; box-shadow: 0 0 0 4px rgba(255,200,21,.15); }

        .vrm-btn {
          width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer;
          font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          letter-spacing: .02em; position: relative; overflow: hidden;
          transition: transform .15s ease, box-shadow .15s ease, background-color .15s;
          background: #ffc815;
          color: #121b2d; box-shadow: 0 4px 18px rgba(255,200,21,.25);
        }
        .vrm-btn:hover:not(:disabled) { transform: translateY(-2px); background: #e5b20f; box-shadow: 0 6px 22px rgba(255,200,21,.35); }
        .vrm-btn:active:not(:disabled) { transform: translateY(0); }
        .vrm-btn:disabled { opacity: .7; cursor: not-allowed; }
        .spin-svg { animation: spinAnim .7s linear infinite; }

        .stat-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 30px; padding: 7px 14px 7px 8px; backdrop-filter: blur(8px);
        }
        .stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          flex: "0 0 46%",
          background: "linear-gradient(145deg, #121b2d 0%, #1a263b 100%)",
          padding: "40px 44px",
        }}
      >
        <div
          className="grid-scroll absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,200,21,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,200,21,.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: "35%", left: "50%", transform: "translate(-50%,-50%)",
            width: 500, height: 500,
            background: "radial-gradient(circle,rgba(255,200,21,.08) 0%,transparent 65%)",
          }}
        />

        {/* Brand Header */}
        <div style={{ position: "relative", zIndex: 2 }} className="flex items-center gap-2">
          <Image src={logo} alt="RydBazzar Logo" className="h-8 w-auto" priority />
        </div>

        {/* Center Car Animation Graphics */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative" style={{ width: 320, height: 120 }}>
            <svg viewBox="0 0 320 120" width="320" height="120" className="absolute inset-0">
              <rect x="0" y="68" width="320" height="28" rx="4" fill="rgba(255,255,255,.04)" />
              <line x1="0" y1="82" x2="320" y2="82" stroke="rgba(255,200,21,.3)" strokeWidth="2" className="road-dash" />
              <line x1="0" y1="68" x2="320" y2="68" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              <line x1="0" y1="96" x2="320" y2="96" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              {[60, 160, 260].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="55" r="5" fill="#ffc815" opacity=".8" />
                  <line x1={x} y1="60" x2={x} y2="68" stroke="#ffc815" strokeWidth="1.5" opacity=".4" />
                </g>
              ))}
            </svg>
            <div
              className="cab-anim absolute"
              style={{ bottom: 28, left: 0, fontSize: 36, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(255,200,21,.3))" }}
            >
              🚕
            </div>
          </div>

          <div className="float-anim flex gap-3 flex-wrap justify-center">
            {[
              { label: "Verified Drivers", value: "100%", icon: "🛡️" },
              { label: "Available",        value: "24/7", icon: "⏰" },
              { label: "Safe Journeys",    value: "10M+", icon: "🙌" },
            ].map((c) => (
              <div
                key={c.label}
                className="text-center"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 14, padding: "14px 16px",
                  backdropFilter: "blur(12px)", minWidth: 95,
                }}
              >
                <div className="text-xl mb-1">{c.icon}</div>
                <p className="text-lg font-extrabold text-white leading-none">{c.value}</p>
                <p className="text-[10px] mt-1.5 font-semibold tracking-wider" style={{ color: "rgba(255,255,255,.4)" }}>
                  {c.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Safe. Reliable.<br />
              Always <span style={{ color: "#ffc815" }}>On Time.</span>
            </h2>
          </div>
        </div>

        {/* Footer Status Indicators */}
        <div className="relative z-10 flex gap-2 flex-wrap justify-center mt-4">
          {[
            { label: "Cabs nearby",      color: "#22c55e" },
            { label: "Secure Payments",  color: "#ffc815" },
            { label: "Support Active",   color: "#38bdf8" },
          ].map((p) => (
            <div key={p.label} className="stat-pill">
              <span className="stat-dot" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,.65)" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (Interactive Form) */}
      <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-6 py-10 lg:px-12">
        <div className="w-full max-w-[400px]">

          {/* Dynamic Header */}
          <div className="fu1 mb-9">
            <div
              className="inline-flex items-center gap-2 rounded-full mb-4"
              style={{ background: "rgba(255,200,21,.1)", border: "1px solid rgba(255,200,21,.2)", padding: "5px 14px" }}
            >
              <span className="inline-block rounded-full animate-pulse" style={{ width: 7, height: 7, background: "#ffc815" }} />
              <span className="text-xs font-bold tracking-widest" style={{ color: "#e5b20f" }}>
                RYDBAZZAR SECURE
              </span>
            </div>
            <h1 className="font-extrabold text-[#121b2d] tracking-tight leading-tight mb-2" style={{ fontSize: "clamp(28px,5vw,34px)" }}>
              {!isOtpStep ? "Welcome back" : "Verify Security"}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.45)" }}>
              {!isOtpStep ? "Enter your mobile number to sign in or register" : `Code sent to +91 ${mobile}`}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {!isOtpStep ? (
              <>
                {/* Mobile Number Input */}
                <div className="fu2">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "rgba(0,0,0,.5)" }}>
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "rgba(0,0,0,.3)" }}>
                      📱
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="vrm-input"
                      placeholder="Enter 10 digit number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(e, handleSendOtp)}
                    />
                  </div>
                </div>

                {/* Role Dropdown Selector */}
                <div className="fu3">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "rgba(0,0,0,.5)" }}>
                    Account Role
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "rgba(0,0,0,.3)" }}>
                      👤
                    </span>
                    <select
                      className="vrm-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-400">▼</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="fu4">
                  <button className="vrm-btn" onClick={handleSendOtp} disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2.5">
                        <svg className="spin-svg" width="16" height="16" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(18,27,45,.2)" strokeWidth="2" />
                          <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#121b2d" strokeWidth="2" />
                        </svg>
                        Sending Code...
                      </span>
                    ) : (
                      "Send OTP Verification →"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="fu2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(0,0,0,.5)" }}>
                      Enter 6-Digit OTP
                    </label>
                    <button 
                      onClick={() => setIsOtpStep(false)} 
                      className="text-xs font-bold no-underline text-[#e5b20f] bg-transparent border-none cursor-pointer hover:underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "rgba(0,0,0,.3)" }}>
                      🔑
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      className="vrm-input"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(e, handleVerifyOtp)}
                      style={{ fontWeight: "bold", letterSpacing: "2px" }}
                    />
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="fu3">
                  <button className="vrm-btn" onClick={handleVerifyOtp} disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2.5">
                        <svg className="spin-svg" width="16" height="16" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(18,27,45,.2)" strokeWidth="2" />
                          <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#121b2d" strokeWidth="2" />
                        </svg>
                        Verifying Code...
                      </span>
                    ) : (
                      "Verify & Access Dashboard →"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="fu6 text-center text-xs mt-7 leading-relaxed" style={{ color: "rgba(0,0,0,.35)" }}>
            Protected by RydBazzar Security &nbsp;·&nbsp;
            <Link href="#" className="font-semibold no-underline text-[#e5b20f] hover:underline">Privacy Policy</Link>
          </p>

        </div>
      </div>
    </div>
  )
}