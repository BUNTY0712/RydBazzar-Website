"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLoginMutation } from "@/app/store/api/authApi"
import { toast } from "sonner"
// import { useLoginMutation } from "@/app/store/api/authApi"
// import { toast } from "sonner"

export default function LoginPage() {
  // const [loginRequest, { isLoading }] = useLoginMutation()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [checked, setChecked] = useState(false)

const [loginRequest] = useLoginMutation()

const handleSubmit = async () => {
  if (!email || !password) {
 toast.error("Please enter both email and password")
    return
  }

  setIsLoading(true)

  try {
    const res = await loginRequest({
      email: email,
      password: password,
    }).unwrap()

    // ✅ Save token
    if (res?.token) {
      localStorage.setItem("token", res.token)
    }

    // Optional: save user
    if (res?.user) {
      localStorage.setItem("user", JSON.stringify(res.user))
    }

    setIsLoading(false)

    // Redirect
    router.replace("/dashboard")
     toast.success(res?.message || "Login successful")

  } catch (err: any) {
    setIsLoading(false)
    toast.error(err?.data?.message || "Login failed")
  }
}

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action()
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#f0f4f8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        body { font-family: 'DM Sans', sans-serif; }

        @keyframes truckMove {
          0%   { transform: translateX(-100px); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(360px); opacity: 0; }
        }
        @keyframes roadDash  { to { stroke-dashoffset: -40; } }
        @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gridScroll  { from { transform:translateY(0); } to { transform:translateY(-40px); } }
        @keyframes shimmer     { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes spinAnim    { to { transform: rotate(360deg); } }

        .truck-anim   { animation: truckMove 4s ease-in-out infinite; }
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
          border: 1.5px solid rgba(0,0,0,.10); font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #111; background: #fafafa;
          outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
          box-sizing: border-box;
        }
        .vrm-input:focus { border-color: #0ea5d4; background: #fff; box-shadow: 0 0 0 4px rgba(14,165,212,.10); }
        .vrm-input::placeholder { color: rgba(0,0,0,.28); }

        .vrm-btn {
          width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer;
          font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          letter-spacing: .02em; position: relative; overflow: hidden;
          transition: transform .15s ease, box-shadow .15s ease;
          background: linear-gradient(135deg, #0ea5d4 0%, #1e3a5f 100%);
          color: #fff; box-shadow: 0 4px 18px rgba(14,165,212,.35);
        }
        .vrm-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(14,165,212,.45); }
        .vrm-btn:active:not(:disabled) { transform: translateY(0); }
        .vrm-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.15) 50%, transparent 100%);
          background-size: 200% 100%; animation: shimmer 2.4s linear infinite;
        }
        .vrm-btn:disabled { opacity: .7; cursor: not-allowed; }
        .spin-svg { animation: spinAnim .7s linear infinite; }

        .stat-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
          border-radius: 30px; padding: 7px 14px 7px 8px; backdrop-filter: blur(8px);
        }
        .stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      `}</style>

      {/* ─────────────────────────────────────────
          LEFT PANEL
      ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          flex: "0 0 48%",
          background: "linear-gradient(145deg,#0d1f33 0%,#0a2a45 50%,#0d1f33 100%)",
          padding: "40px 44px",
        }}
      >
        {/* Grid Background */}
        <div
          className="grid-scroll absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,165,212,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,212,.07) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial Glow */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: "35%", left: "50%", transform: "translate(-50%,-50%)",
            width: 500, height: 500,
            background: "radial-gradient(circle,rgba(14,165,212,.18) 0%,transparent 65%)",
          }}
        />

        {/* Logo */}
       <div style={{ position: "relative", zIndex: 2 }}>
  <Image
    src="https://www.advators.com/wp-content/uploads/2025/10/cropped-ADVATORS_oo.png.webp"
    alt="Advators Logo"
    width={300}   // ✅ required
    height={160}  // ✅ required
    style={{
      height: "160px",
      width: "auto",
      objectFit: "contain",
      filter: "brightness(1.1) drop-shadow(0 0 12px rgba(14,165,212,0.5))",
      margin: "0 auto",
    }}
  />
</div>

        {/* Center Illustration */}
        <div className="relative z-10 flex flex-col items-center gap-8">

          {/* Road + Truck */}
          <div className="relative" style={{ width: 320, height: 120 }}>
            <svg viewBox="0 0 320 120" width="320" height="120" className="absolute inset-0">
              <rect x="0" y="68" width="320" height="28" rx="4" fill="rgba(255,255,255,.06)" />
              <line x1="0" y1="82" x2="320" y2="82" stroke="rgba(14,165,212,.4)" strokeWidth="2" className="road-dash" />
              <line x1="0" y1="68" x2="320" y2="68" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
              <line x1="0" y1="96" x2="320" y2="96" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
              {[60, 160, 260].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="55" r="5" fill="#0ea5d4" opacity=".9" />
                  <line x1={x} y1="60" x2={x} y2="68" stroke="#0ea5d4" strokeWidth="1.5" opacity=".5" />
                </g>
              ))}
            </svg>
            <div
              className="truck-anim absolute"
              style={{ bottom: 28, left: 0, fontSize: 36, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(14,165,212,.4))" }}
            >
              🚛
            </div>
          </div>

          {/* Stat Cards */}
          <div className="float-anim flex gap-3 flex-wrap justify-center">
            {[
              { label: "Campaigns", value: "12,500+", icon: "📢" },
              { label: "Engagement", value: "94.8%",  icon: "🔥" },
              { label: "Brands",     value: "320+",   icon: "🏆" },
            ].map((c) => (
              <div
                key={c.label}
                className="text-center"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(14,165,212,.2)",
                  borderRadius: 14, padding: "14px 16px",
                  backdropFilter: "blur(12px)", minWidth: 90,
                }}
              >
                <div className="text-xl mb-1">{c.icon}</div>
                <p className="text-xl font-extrabold text-white leading-none">{c.value}</p>
                <p className="text-xs mt-1 font-medium tracking-widest" style={{ color: "rgba(255,255,255,.45)" }}>
                  {c.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Innovating Ads.<br />
              <span style={{ color: "#0ea5d4" }}>Elevating Brands.</span>
            </h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,.4)" }}>
              Create, manage &amp; scale your digital campaigns<br />from one powerful platform.
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="relative z-10 flex gap-2 flex-wrap justify-center mt-4">
          {[
            { label: "12 campaigns live",  color: "#22c55e" },
            { label: "5 ads under review", color: "#f59e0b" },
            { label: "Platform online",    color: "#0ea5d4" },
          ].map((p) => (
            <div key={p.label} className="stat-pill">
              <span className="stat-dot" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,.7)" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────
          RIGHT PANEL
      ───────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-6 py-10 lg:px-12">
        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div className="fu1 mb-9">
            <div
              className="inline-flex items-center gap-2 rounded-full mb-4"
              style={{ background: "rgba(14,165,212,.10)", border: "1px solid rgba(14,165,212,.2)", padding: "5px 14px" }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 7, height: 7, background: "#0ea5d4", boxShadow: "0 0 6px #0ea5d4" }}
              />
              <span className="text-xs font-semibold tracking-widest" style={{ color: "#0ea5d4" }}>
                ADVATORS PANEL
              </span>
            </div>
            <h1 className="font-extrabold text-[#0d1f33] tracking-tight leading-tight mb-2"
              style={{ fontSize: "clamp(28px,5vw,40px)" }}>
              Welcome back
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,.42)" }}>
              Sign in to your Advators dashboard
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">

            {/* Email */}
            <div className="fu2">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: "rgba(0,0,0,.5)" }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                  style={{ color: "rgba(0,0,0,.3)" }}>
                  ✉
                </span>
                <input
                  type="email"
                  className="vrm-input"
                  placeholder="admin@advators.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => document.getElementById("passInput")?.focus())}
                />
              </div>
            </div>

            {/* Password */}
            <div className="fu3">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(0,0,0,.5)" }}>
                  Password
                </label>
                <Link href="/forgot-password"
                  className="text-xs font-semibold no-underline"
                  style={{ color: "#0ea5d4" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                  style={{ color: "rgba(0,0,0,.3)" }}>
                  🔒
                </span>
                <input
                  id="passInput"
                  type={showPass ? "text" : "password"}
                  className="vrm-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-sm p-1 leading-none"
                  style={{ color: "rgba(0,0,0,.35)" }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="fu4 flex items-center gap-2.5">
              <div
                onClick={() => setChecked(!checked)}
                className="flex items-center justify-center flex-shrink-0 cursor-pointer rounded transition-all"
                style={{
                  width: 18, height: 18,
                  border: "1.5px solid rgba(14,165,212,.4)",
                  background: checked ? "rgba(14,165,212,.15)" : "rgba(14,165,212,.08)",
                }}
              >
                {checked && (
                  <span className="text-xs font-bold leading-none" style={{ color: "#0ea5d4" }}>✓</span>
                )}
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(0,0,0,.5)" }}>
                Keep me signed in
              </span>
            </div>

            {/* Submit Button */}
            <div className="fu5">
              <button
                className="vrm-btn"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <svg className="spin-svg" width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" />
                      <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Access Dashboard →"
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="fu6 text-center text-xs mt-7 leading-relaxed" style={{ color: "rgba(0,0,0,.35)" }}>
            Protected by Advators Security &nbsp;·&nbsp;
            <Link href="#" className="font-semibold no-underline" style={{ color: "#0ea5d4" }}>Privacy Policy</Link>
            &nbsp;·&nbsp;
            <Link href="#" className="font-semibold no-underline" style={{ color: "#0ea5d4" }}>Terms</Link>
          </p>

        </div>
      </div>
    </div>
  )
}