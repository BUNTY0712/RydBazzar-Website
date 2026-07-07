"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "../../src/assets/Image/vrm_transport_white.png" // adjust path as needed
import { useResetPasswordMutation, useSendOtpMutation, useVerifyOtpMutation } from "@/app/store/api/authApi"
import { toast } from "sonner"


type Step = "mobile" | "otp" | "reset" | "success"

export default function ForgotPasswordPage() {
  const [step, setStep]               = useState<Step>("mobile")
  const [mobile, setMobile]           = useState("")
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""])
  const [newPass, setNewPass]         = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [resendTimer, setResendTimer] = useState(0)



  const [sendOtp] = useSendOtpMutation()
const [verifyOtpApi] = useVerifyOtpMutation()
const [resetPasswordApi] = useResetPasswordMutation()

  const steps: Step[] = ["mobile", "otp", "reset", "success"]
  const stepIndex = steps.indexOf(step)

  const passwordStrength = (() => {
    const p = newPass
    if (!p) return 0
    let s = 0
    if (p.length >= 6)           s++
    if (p.length >= 10)          s++
    if (/[A-Z]/.test(p))         s++
    if (/[0-9]/.test(p))         s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return Math.min(s, 4)
  })()
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength]
  const strengthColor = ["", "#ef4444", "#f59e0b", "#0ea5d4", "#22c55e"][passwordStrength]

  const simulate = (next: Step) => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(next) }, 1500)
  }

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`)
      el?.focus()
    }
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus()
    }
  }

  const startResend = () => {
    setResendTimer(30)
    const t = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0 } return p - 1 })
    }, 1000)
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        :root {
          --vrm-primary:   #0ea5d4;
          --vrm-deep:      #1e3a5f;
          --vrm-dark:      #0d1f33;
          --vrm-accent-bg: rgba(14,165,212,0.09);
          --vrm-border:    rgba(14,165,212,0.25);
        }

        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes gridScroll {
          from { transform:translateY(0); }
          to   { transform:translateY(-40px); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes float {
          0%,100% { transform:translateY(0);   }
          50%      { transform:translateY(-10px); }
        }
        @keyframes ringPulse {
          0%   { transform:scale(1);   opacity:.5; }
          100% { transform:scale(1.65);opacity:0;  }
        }
        @keyframes checkPop {
          0%   { transform:scale(0) rotate(-20deg); opacity:0; }
          60%  { transform:scale(1.15) rotate(4deg); opacity:1; }
          100% { transform:scale(1) rotate(0deg);   opacity:1; }
        }
        @keyframes successGlow {
          0%,100% { box-shadow:0 0 20px rgba(14,165,212,0.3); }
          50%      { box-shadow:0 0 48px rgba(14,165,212,0.6); }
        }
        @keyframes truckDrive {
          0%   { transform:translateX(-80px); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform:translateX(300px); opacity:0; }
        }
        @keyframes roadDash {
          to { stroke-dashoffset:-40; }
        }
        @keyframes stepFill {
          from { width:0%; }
          to   { width:100%; }
        }

        .vrm-grid-bg {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(14,165,212,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,212,0.07) 1px, transparent 1px);
          background-size:40px 40px;
          animation:gridScroll 4s linear infinite;
        }

        .vrm-input {
          width:100%; padding:13px 16px;
          border-radius:11px;
          border:1.5px solid rgba(0,0,0,0.10);
          font-size:14px; font-family:'DM Sans',sans-serif;
          color:#111; background:#fff; outline:none;
          transition:border-color .2s, box-shadow .2s;
          box-sizing:border-box;
        }
        .vrm-input:focus {
          border-color:var(--vrm-primary);
          box-shadow:0 0 0 4px rgba(14,165,212,0.10);
        }
        .vrm-input::placeholder { color:rgba(0,0,0,0.26); }

        .vrm-label {
          display:block; font-size:11.5px; font-weight:700;
          color:rgba(0,0,0,0.45); letter-spacing:.07em;
          text-transform:uppercase; margin-bottom:7px;
        }

        .vrm-btn {
          width:100%; padding:14px; border-radius:12px; border:none;
          cursor:pointer; font-size:15px; font-weight:700;
          font-family:'DM Sans',sans-serif; letter-spacing:.02em;
          position:relative; overflow:hidden;
          transition:transform .15s, box-shadow .15s;
          background:linear-gradient(135deg,#0ea5d4 0%,#1e3a5f 100%);
          color:#fff; box-shadow:0 4px 18px rgba(14,165,212,0.35);
        }
        .vrm-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 8px 28px rgba(14,165,212,0.45);
        }
        .vrm-btn:disabled { opacity:.65; cursor:not-allowed; }
        .vrm-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.14) 50%,transparent 100%);
          background-size:200% 100%;
          animation:shimmer 2.4s linear infinite;
        }

        .otp-box {
          width:48px; height:56px; border-radius:12px;
          border:2px solid rgba(0,0,0,0.10);
          font-size:22px; font-weight:800;
          font-family:'Syne',sans-serif; color:#0d1f33;
          text-align:center; outline:none; background:#fff;
          transition:border-color .2s, box-shadow .2s, transform .15s;
          caret-color:#0ea5d4;
        }
        .otp-box:focus {
          border-color:var(--vrm-primary);
          box-shadow:0 0 0 4px rgba(14,165,212,0.12);
          transform:scale(1.06);
        }
        .otp-box.filled {
          border-color:rgba(14,165,212,0.45);
          background:rgba(14,165,212,0.05);
        }

        .fu1{animation:fadeSlideUp .45s ease both .05s;}
        .fu2{animation:fadeSlideUp .45s ease both .12s;}
        .fu3{animation:fadeSlideUp .45s ease both .19s;}
        .fu4{animation:fadeSlideUp .45s ease both .26s;}
        .fu5{animation:fadeSlideUp .45s ease both .33s;}
        .fu6{animation:fadeSlideUp .45s ease both .40s;}

        .step-panel { animation:fadeSlideUp .4s ease both; }

        .truck-anim { animation:truckDrive 4s ease-in-out infinite; }
        .road-dash  {
          stroke-dasharray:12 8;
          animation:roadDash .6s linear infinite;
        }
      `}</style>

      {/* ══════════════ LEFT — Form Panel ══════════════ */}
      <div
        style={{
          flex:1, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          background:"#f8fafc", padding:"40px 32px", overflowY:"auto",
        }}
      >
        <div style={{ width:"100%", maxWidth:"400px" }}>

          {/* Logo */}
          <div className="fu1" style={{ marginBottom:"32px" }}>
            <Image
              src={logo} alt="VRM Transport"
              style={{
                height:"38px", width:"auto", objectFit:"contain",
                filter:"brightness(1.05) drop-shadow(0 0 8px rgba(14,165,212,0.3))",
              }}
            />
          </div>

          {/* ── Progress Steps ── */}
          {step !== "success" && (
            <div className="fu2" style={{ marginBottom:"32px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                {["mobile","otp","reset"].map((s, i) => {
                  const done    = stepIndex > i
                  const current = stepIndex === i
                  return (
                    <div key={s} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "none" }}>
                      {/* Circle */}
                      <div style={{
                        width:"32px", height:"32px", borderRadius:"50%",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0,
                        background: done
                          ? "linear-gradient(135deg,#0ea5d4,#1e3a5f)"
                          : current
                            ? "rgba(14,165,212,0.12)"
                            : "rgba(0,0,0,0.06)",
                        border: current
                          ? "2px solid #0ea5d4"
                          : done ? "none" : "2px solid rgba(0,0,0,0.10)",
                        transition:"all .3s ease",
                      }}>
                        {done ? (
                          <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                            <path d="M1.5 5.5L5 9L11.5 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span style={{
                            fontSize:"12px", fontWeight:700,
                            color: current ? "#0ea5d4" : "rgba(0,0,0,0.3)",
                          }}>{i + 1}</span>
                        )}
                      </div>
                      {/* Connector */}
                      {i < 2 && (
                        <div style={{
                          flex:1, height:"2px", margin:"0 4px",
                          background:"rgba(0,0,0,0.07)",
                          position:"relative", overflow:"hidden", borderRadius:"2px",
                        }}>
                          {done && (
                            <div style={{
                              position:"absolute", inset:0,
                              background:"linear-gradient(90deg,#0ea5d4,#1e3a5f)",
                              borderRadius:"2px",
                            }} />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px", paddingRight:"0px" }}>
                {["Mobile","Verify OTP","New Password"].map((label, i) => (
                  <span key={label} style={{
                    fontSize:"10px", fontWeight:600,
                    color: stepIndex === i ? "#0ea5d4" : stepIndex > i ? "#1e3a5f" : "rgba(0,0,0,0.3)",
                    letterSpacing:".04em", textTransform:"uppercase",
                    flex: i < 2 ? 1 : "none",
                  }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

       

          {/* ════════════════════════════
              STEP 1 — Mobile Number
          ════════════════════════════ */}
          {step === "mobile" && (
            <div className="step-panel">
              <div className="fu2" style={{ marginBottom:"28px" }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:"7px",
                  background:"rgba(14,165,212,0.10)",
                  border:"1px solid rgba(14,165,212,0.2)",
                  borderRadius:"30px", padding:"5px 14px", marginBottom:"14px",
                }}>
                  <span style={{
                    width:"7px", height:"7px", borderRadius:"50%",
                    background:"#0ea5d4", boxShadow:"0 0 6px #0ea5d4",
                    display:"inline-block",
                  }}/>
                  <span style={{ fontSize:"11.5px", fontWeight:600, color:"#0ea5d4", letterSpacing:".06em" }}>
                    ACCOUNT RECOVERY
                  </span>
                </div>
                <h1 style={{
                  fontSize:"30px", fontWeight:800,
                  color:"#0d1f33", letterSpacing:"-0.03em", lineHeight:1.2,
                  margin:"0 0 8px",
                }}>
                  Forgot your password?
                </h1>
                <p style={{ fontSize:"13.5px", color:"rgba(0,0,0,0.42)", margin:0, lineHeight:1.6 }}>
                  Enter your registered mobile number and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <div className="fu3" style={{ marginBottom:"20px" }}>
                <label className="vrm-label">Mobile Number</label>
                <div style={{ position:"relative" }}>
                  <div style={{
                    position:"absolute", left:"12px", top:"50%",
                    transform:"translateY(-50%)",
                    display:"flex", alignItems:"center", gap:"6px",
                    borderRight:"1.5px solid rgba(0,0,0,0.10)",
                    paddingRight:"10px", pointerEvents:"none",
                  }}>
                    <span style={{ fontSize:"14px" }}>🇮🇳</span>
                    <span style={{ fontSize:"12px", fontWeight:600, color:"rgba(0,0,0,0.45)" }}>+91</span>
                  </div>
                  <input
                    type="tel"
                    className="vrm-input"
                    placeholder="9999999999"
                    maxLength={10}
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g,""))}
                    style={{ paddingLeft:"74px" }}
                  />
                </div>
                {mobile.length > 0 && mobile.length < 10 && (
                  <p style={{ fontSize:"11px", color:"#ef4444", marginTop:"5px", fontWeight:500 }}>
                    Enter a valid 10-digit mobile number
                  </p>
                )}
              </div>

              <div className="fu4">
                <button
                  className="vrm-btn"
                  onClick={async () => {
  try {
    setLoading(true)

    const res = await sendOtp({ mobile }).unwrap()

    setStep("otp")
    toast.success( "OTP sent successfully " + res?.otp, 
    )
    setLoading(false)
    startResend()

  } catch (err: any) {
  toast.error(
    err?.data?.message || "Failed to send OTP",
    {
      description: err?.data?.error || "Something went wrong",
    }
  )
    setLoading(false)
}
}}
                  disabled={loading || mobile.length !== 10}
                >
                  {loading ? (
                    <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation:"spin .7s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                        <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Send OTP →"}
                </button>
              </div>

              <p className="fu5" style={{ textAlign:"center", fontSize:"13px", color:"rgba(0,0,0,0.4)", marginTop:"20px" }}>
                Remember your password?{" "}
                <Link href="/login" style={{ color:"#0ea5d4", fontWeight:700, textDecoration:"none" }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ════════════════════════════
              STEP 2 — OTP Verify
          ════════════════════════════ */}
          {step === "otp" && (
            <>
               <button
  onClick={() => setStep("mobile")}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    color: "rgba(0,0,0,0.4)",
    marginBottom: "12px",
  }}
>
  ← Back
</button>
   <div className="step-panel">
              <div className="fu2" style={{ marginBottom:"28px" }}>
                {/* Phone icon circle */}
                <div style={{
                  width:"56px", height:"56px", borderRadius:"16px",
                  background:"rgba(14,165,212,0.10)",
                  border:"1.5px solid rgba(14,165,212,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"24px", marginBottom:"16px",
                }}>
                  📱
                </div>
                <h1 style={{
                  fontSize:"32px", fontWeight:800,
                  color:"#0d1f33", letterSpacing:"-0.03em", lineHeight:1.2,
                  margin:"0 0 8px",
                }}>
                  Verify your number
                </h1>
                <p style={{ fontSize:"13.5px", color:"rgba(0,0,0,0.42)", margin:0, lineHeight:1.6 }}>
                  We sent a 6-digit code to{" "}
                  <strong style={{ color:"#0d1f33" }}>+91 {mobile}</strong>
                </p>
              </div>

              {/* OTP boxes */}
              <div className="fu3" style={{ marginBottom:"24px" }}>
                <label className="vrm-label">Enter 6-Digit OTP</label>
                <div style={{ display:"flex", gap:"8px", justifyContent:"space-between" }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      className={`otp-box${digit ? " filled" : ""}`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend */}
              <div className="fu4" style={{ marginBottom:"20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"10px 14px", borderRadius:"10px",
                  background:"rgba(0,0,0,0.03)", border:"1px solid rgba(0,0,0,0.06)",
                }}>
                  <span style={{ fontSize:"12.5px", color:"rgba(0,0,0,0.45)" }}>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Didn't receive the code?"}
                  </span>
                <button
  onClick={async () => {
    if (resendTimer) return

    try {
      setLoading(true)

      const res = await sendOtp({ mobile }).unwrap()

      toast.success("OTP resent successfully " + res?.otp)

      startResend() // start timer after success
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to resend OTP",
        {
          description: err?.data?.error || "Try again",
        }
      )
    } finally {
      setLoading(false)
    }
  }}
  disabled={resendTimer > 0 || loading}
  style={{
    background:"none",
    border:"none",
    cursor: resendTimer > 0 ? "not-allowed" : "pointer",
    fontSize:"12.5px",
    fontWeight:700,
    color: resendTimer > 0 ? "rgba(0,0,0,0.25)" : "#0ea5d4",
    fontFamily:"'DM Sans',sans-serif",
    padding:0,
  }}
>
  {loading ? "Sending..." : "Resend"}
</button>
                </div>
              </div>

              <div className="fu5">
                <button
                  className="vrm-btn"
                onClick={async () => {
  try {
    setLoading(true)

    await verifyOtpApi({
      mobile,
      otp: otp.join(""),
    }).unwrap()

    setStep("reset")

  } catch (err: any) {
  toast.error(
    err?.data?.message || "Invalid OTP",
    {
      description: err?.data?.error || "Please try again",
    }
  )
} finally {
    setLoading(false)
  }
}}
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? (
                    <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation:"spin .7s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                        <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify OTP →"}
                </button>
              </div>

              <button
                onClick={() => setStep("mobile")}
                style={{
                  display:"block", margin:"14px auto 0",
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:"13px", color:"rgba(0,0,0,0.4)", fontFamily:"'DM Sans',sans-serif",
                }}
              >
                ← Change number
              </button>
            </div>
            </>
         
          )}

          {/* ════════════════════════════
              STEP 3 — Reset Password
          ════════════════════════════ */}
          {step === "reset" && (

            <>
               <button
  onClick={() => setStep("otp")}
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    color: "rgba(0,0,0,0.4)",
    marginBottom: "12px",
  }}
>
  ← Back
</button>
  <div className="step-panel">
              <div className="fu2" style={{ marginBottom:"28px" }}>
                <div style={{
                  width:"56px", height:"56px", borderRadius:"16px",
                  background:"rgba(14,165,212,0.10)",
                  border:"1.5px solid rgba(14,165,212,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"24px", marginBottom:"16px",
                }}>
                  🔑
                </div>
                <h1 style={{
                  fontSize:"32px", fontWeight:800,
                  color:"#0d1f33", letterSpacing:"-0.03em", lineHeight:1.2,
                  margin:"0 0 8px",
                }}>
                  Set new password
                </h1>
                <p style={{ fontSize:"13.5px", color:"rgba(0,0,0,0.42)", margin:0, lineHeight:1.6 }}>
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                {/* New Password */}
                <div className="fu3">
                  <label className="vrm-label">New Password</label>
                  <div style={{ position:"relative" }}>
                    <span style={{
                      position:"absolute", left:"13px", top:"50%",
                      transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none",
                    }}>🔒</span>
                    <input
                      type={showNew ? "text" : "password"}
                      className="vrm-input"
                      placeholder="Min. 6 characters"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      style={{ paddingLeft:"40px", paddingRight:"44px" }}
                    />
                    <button onClick={() => setShowNew(p => !p)} style={{
                      position:"absolute", right:"12px", top:"50%",
                      transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer",
                      color:"rgba(0,0,0,0.32)", fontSize:"14px", padding:"4px", lineHeight:1,
                    }}>
                      {showNew ? "🙈" : "👁"}
                    </button>
                  </div>
                  {newPass && (
                    <div style={{ marginTop:"8px" }}>
                      <div style={{ display:"flex", gap:"4px", marginBottom:"4px" }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{
                            flex:1, height:"3px", borderRadius:"4px",
                            background: i <= passwordStrength ? strengthColor : "rgba(0,0,0,0.08)",
                            transition:"background .25s ease",
                          }}/>
                        ))}
                      </div>
                      <p style={{ fontSize:"11px", color:strengthColor, fontWeight:600, margin:0 }}>
                        {strengthLabel} password
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="fu4">
                  <label className="vrm-label">Confirm Password</label>
                  <div style={{ position:"relative" }}>
                    <span style={{
                      position:"absolute", left:"13px", top:"50%",
                      transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none",
                    }}>🔐</span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="vrm-input"
                      placeholder="Re-enter password"
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      style={{
                        paddingLeft:"40px", paddingRight:"44px",
                        borderColor: confirmPass
                          ? confirmPass === newPass ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.45)"
                          : undefined,
                      }}
                    />
                    <button onClick={() => setShowConfirm(p => !p)} style={{
                      position:"absolute", right:"12px", top:"50%",
                      transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer",
                      color:"rgba(0,0,0,0.32)", fontSize:"14px", padding:"4px", lineHeight:1,
                    }}>
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                    {confirmPass && (
                      <span style={{
                        position:"absolute", right:"40px", top:"50%",
                        transform:"translateY(-50%)", fontSize:"14px",
                      }}>
                        {confirmPass === newPass ? "✅" : "❌"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password rules */}
                <div className="fu4" style={{
                  padding:"12px 14px", borderRadius:"10px",
                  background:"rgba(14,165,212,0.05)",
                  border:"1px solid rgba(14,165,212,0.15)",
                }}>
                  {[
                    { rule:"At least 6 characters", ok: newPass.length >= 6 },
                    { rule:"One uppercase letter",  ok: /[A-Z]/.test(newPass) },
                    { rule:"One number",            ok: /[0-9]/.test(newPass) },
                  ].map(r => (
                    <div key={r.rule} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px" }}>
                      <span style={{ fontSize:"11px", color: r.ok ? "#22c55e" : "rgba(0,0,0,0.3)" }}>
                        {r.ok ? "✓" : "○"}
                      </span>
                      <span style={{
                        fontSize:"12px", fontWeight:500,
                        color: r.ok ? "#22c55e" : "rgba(0,0,0,0.38)",
                        transition:"color .2s",
                      }}>
                        {r.rule}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="fu5">
                  <button
                    className="vrm-btn"
                  onClick={async () => {
  try {
    setLoading(true)

    await resetPasswordApi({
      mobile,
      otp: otp.join(""),
      password: newPass,
    }).unwrap()

    setStep("success")

  } catch (err: any) {
  toast.error(
    err?.data?.message || "Reset failed",
    {
      description: err?.data?.error || "Something went wrong",
    }
  )
} finally {
    setLoading(false)
  }
}}
                    disabled={loading || !newPass || newPass !== confirmPass || newPass.length < 6}
                  >
                    {loading ? (
                      <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation:"spin .7s linear infinite" }}>
                          <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                          <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Resetting...
                      </span>
                    ) : "Reset Password →"}
                  </button>
                </div>
              </div>
            </div>
            </>
          
          )}

          {/* ════════════════════════════
              STEP 4 — Success
          ════════════════════════════ */}
          {step === "success" && (
            <div className="step-panel" style={{ textAlign:"center" }}>
              {/* Animated success icon */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"28px",
              }}>
                <div style={{ position:"relative" }}>
                  {/* Pulse rings */}
                  {[1,2].map(i => (
                    <div key={i} style={{
                      position:"absolute", inset:0, borderRadius:"50%",
                      border:"2px solid rgba(14,165,212,0.4)",
                      animation:`ringPulse 2s ease-out ${i * .6}s infinite`,
                    }}/>
                  ))}
                  <div style={{
                    width:"80px", height:"80px", borderRadius:"50%",
                    background:"linear-gradient(135deg,#0ea5d4,#1e3a5f)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    animation:"successGlow 2.5s ease-in-out infinite",
                  }}>
                    <svg
                      width="36" height="30" viewBox="0 0 36 30" fill="none"
                      style={{ animation:"checkPop .5s cubic-bezier(.34,1.56,.64,1) both .2s" }}
                    >
                      <path
                        d="M3 15L13 25L33 3"
                        stroke="white" strokeWidth="4"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 style={{
                fontSize:"32px", fontWeight:800,
                color:"#0d1f33", letterSpacing:"-0.03em", lineHeight:1.2,
                margin:"0 0 10px",
              }}>
                Password Reset!
              </h1>
              <p style={{ fontSize:"14px", color:"rgba(0,0,0,0.42)", lineHeight:1.7, margin:"0 0 32px" }}>
                Your password has been updated successfully.<br/>
                You can now sign in with your new credentials.
              </p>

              {/* Summary card */}
              <div style={{
                padding:"16px 20px", borderRadius:"14px",
                background:"rgba(14,165,212,0.06)",
                border:"1px solid rgba(14,165,212,0.18)",
                marginBottom:"28px", textAlign:"left",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"20px" }}>📱</span>
                  <div>
                    <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.38)", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", margin:"0 0 2px" }}>
                      Account
                    </p>
                    <p style={{ fontSize:"14px", fontWeight:700, color:"#0d1f33", margin:0 }}>
                      +91 {mobile}
                    </p>
                  </div>
                  <div style={{
                    marginLeft:"auto",
                    width:"28px", height:"28px", borderRadius:"8px",
                    background:"rgba(34,197,94,0.12)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                      <path d="M1.5 5.5L5 9L11.5 1.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <Link href="/login" style={{ textDecoration:"none" }}>
                <button className="vrm-btn">
                  Back to Sign In →
                </button>
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════ RIGHT — Brand Panel ══════════════ */}
      <div
        style={{
          flex:"0 0 44%",
          background:"linear-gradient(145deg,#0d1f33 0%,#0a2a45 55%,#0d1f33 100%)",
          position:"relative", overflow:"hidden",
          display:"flex", flexDirection:"column",
          justifyContent:"space-between", padding:"40px 44px",
        }}
      >
        <div className="vrm-grid-bg"/>

        {/* Radial glow */}
        <div style={{
          position:"absolute", top:"42%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:"500px", height:"500px", borderRadius:"50%",
          background:"radial-gradient(circle,rgba(14,165,212,0.16) 0%,transparent 65%)",
          pointerEvents:"none",
        }}/>

        {/* ── Logo ── */}
        <div style={{ position:"relative", zIndex:2 }}>
          <Image
            src={logo} alt="VRM Transport"
            style={{
              height:"60px", width:"auto", objectFit:"contain",
              filter:"brightness(1.1) drop-shadow(0 0 12px rgba(14,165,212,0.5))",
            }}
          />
        </div>

        {/* ── Center Visual ── */}
        <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:"32px" }}>

          {/* Shield + lock illustration */}
          <div style={{ position:"relative", width:"200px", height:"160px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {/* Outer ring */}
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ position:"absolute", inset:0 }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(14,165,212,0.12)" strokeWidth="1" strokeDasharray="8 6"/>
              <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(14,165,212,0.08)" strokeWidth="1"/>
              {/* Rotating accent dots */}
              {[0,60,120,180,240,300].map((deg,i) => {
                const rad  = (deg * Math.PI) / 180
                const x    = 100 + 90 * Math.cos(rad)
                const y    = 100 + 90 * Math.sin(rad)
                return <circle key={i} cx={x} cy={y} r="3" fill="rgba(14,165,212,0.4)"/>
              })}
            </svg>

            {/* Shield */}
            <div style={{
              width:"100px", height:"110px",
              background:"linear-gradient(160deg,rgba(14,165,212,0.18) 0%,rgba(30,58,95,0.4) 100%)",
              border:"1.5px solid rgba(14,165,212,0.3)",
              borderRadius:"50% 50% 50% 50% / 60% 60% 40% 40%",
              display:"flex", alignItems:"center", justifyContent:"center",
              backdropFilter:"blur(8px)",
              boxShadow:"0 8px 32px rgba(14,165,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              fontSize:"40px",
              animation:"float 3.5s ease-in-out infinite",
            }}>
              🔐
            </div>
          </div>

          {/* Text */}
          <div style={{ textAlign:"center" }}>
            <h2 style={{
               fontSize:"32px", fontWeight:800,
              color:"#fff", letterSpacing:"-0.02em", lineHeight:1.25,
              margin:"0 0 12px",
            }}>
              Secure account<br/>
              <span style={{ color:"#0ea5d4" }}>recovery.</span>
            </h2>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.38)", lineHeight:1.7, margin:0 }}>
              Your data is protected with 256-bit<br/>encryption throughout the process.
            </p>
          </div>

          {/* Step guide cards */}
          <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:"10px" }}>
            {[
              { step:"01", title:"Enter mobile number",    desc:"We verify your registered number",        icon:"📱" },
              { step:"02", title:"Verify with OTP",        desc:"6-digit code sent via SMS instantly",     icon:"✉️" },
              { step:"03", title:"Set new password",       desc:"Choose a strong, unique password",        icon:"🔑" },
            ].map((item, i) => (
              <div
                key={item.step}
                style={{
                  display:"flex", alignItems:"center", gap:"14px",
                  padding:"12px 16px", borderRadius:"12px",
                  background: stepIndex > i
                    ? "rgba(14,165,212,0.15)"
                    : stepIndex === i
                      ? "rgba(14,165,212,0.10)"
                      : "rgba(255,255,255,0.04)",
                  border: stepIndex === i
                    ? "1px solid rgba(14,165,212,0.35)"
                    : stepIndex > i
                      ? "1px solid rgba(14,165,212,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
                  transition:"all .3s ease",
                }}
              >
                <div style={{
                  width:"36px", height:"36px", borderRadius:"10px", flexShrink:0,
                  background: stepIndex > i
                    ? "linear-gradient(135deg,#0ea5d4,#1e3a5f)"
                    : "rgba(255,255,255,0.07)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"16px",
                }}>
                  {stepIndex > i ? (
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                      <path d="M1.5 5.5L5 9L11.5 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : item.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{
                    fontSize:"12.5px", fontWeight:700, margin:"0 0 2px",
                    color: stepIndex >= i ? "#fff" : "rgba(255,255,255,0.4)",
                  }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", margin:0 }}>
                    {item.desc}
                  </p>
                </div>
                <span style={{
                  fontSize:"10px", fontWeight:700,
                  color: stepIndex > i ? "#0ea5d4" : "rgba(255,255,255,0.2)",
                  letterSpacing:".04em",
                }}>
                  {stepIndex > i ? "DONE" : item.step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{
            display:"flex", gap:"10px", padding:"14px 16px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"14px", backdropFilter:"blur(8px)",
            marginTop:"12px",
          }}>
            {[
              { icon:"🔒", label:"256-bit SSL" },
              { icon:"⚡", label:"Instant OTP" },
              { icon:"🛡️", label:"Zero Data Leak" },
            ].map(b => (
              <div key={b.label} style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontSize:"18px", marginBottom:"4px" }}>{b.icon}</div>
                <p style={{ fontSize:"10.5px", color:"rgba(255,255,255,0.45)", margin:0, fontWeight:600, letterSpacing:".04em" }}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}