"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import logo from "../../src/assets/Image/vrm_transport.png" // adjust path as needed

const roles = [
  { value: "admin",    label: "Admin",    icon: "🛡️", desc: "Full system access" },
  { value: "manager",  label: "Manager",  icon: "📋", desc: "Operations & reports" },
  { value: "driver",   label: "Driver",   icon: "🚛", desc: "Route & delivery access" },
  { value: "operator", label: "Operator", icon: "⚙️", desc: "Fleet management" },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })
  const [showPass, setShowPass]        = useState(false)
  const [showConfirm, setShowConfirm]  = useState(false)
  const [loading, setLoading]          = useState(false)
  const [agreed, setAgreed]            = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const passwordStrength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6)                    s++
    if (p.length >= 10)                   s++
    if (/[A-Z]/.test(p))                  s++
    if (/[0-9]/.test(p))                  s++
    if (/[^A-Za-z0-9]/.test(p))          s++
    return Math.min(s, 4)
  })()

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength]
  const strengthColor = ["", "#ef4444", "#f59e0b", "#0ea5d4", "#22c55e"][passwordStrength]

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f0f4f8",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

        :root {
          --vrm-primary:    #0ea5d4;
          --vrm-deep:       #1e3a5f;
          --vrm-dark:       #0d1f33;
          --vrm-accent-bg:  rgba(14,165,212,0.09);
          --vrm-border:     rgba(14,165,212,0.22);
        }

        /* ── animations ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-40px); }
        }
        @keyframes orbitA {
          from { transform: rotate(0deg)   translateX(110px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes orbitB {
          from { transform: rotate(180deg) translateX(75px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(75px) rotate(-540deg); }
        }
        @keyframes orbitC {
          from { transform: rotate(60deg)  translateX(148px) rotate(-60deg); }
          to   { transform: rotate(420deg) translateX(148px) rotate(-420deg); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50%     { transform: scale(1.06); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .vrm-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(14,165,212,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,212,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridScroll 4s linear infinite;
        }

        /* ── form inputs ── */
        .vrm-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 11px;
          border: 1.5px solid rgba(0,0,0,0.10);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .vrm-input:focus {
          border-color: var(--vrm-primary);
          box-shadow: 0 0 0 4px rgba(14,165,212,0.10);
        }
        .vrm-input::placeholder { color: rgba(0,0,0,0.26); }

        .vrm-label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: rgba(0,0,0,0.45);
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        /* ── role card ── */
        .role-card {
          flex: 1;
          padding: 11px 10px;
          border-radius: 11px;
          border: 1.5px solid rgba(0,0,0,0.09);
          background: #fff;
          cursor: pointer;
          text-align: center;
          transition: all 0.18s ease;
        }
        .role-card:hover {
          border-color: var(--vrm-border);
          background: var(--vrm-accent-bg);
        }
        .role-card.selected {
          border-color: var(--vrm-primary);
          background: rgba(14,165,212,0.08);
          box-shadow: 0 0 0 3px rgba(14,165,212,0.12);
        }

        /* ── submit button ── */
        .vrm-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
          background: linear-gradient(135deg, #0ea5d4 0%, #1e3a5f 100%);
          color: #fff;
          box-shadow: 0 4px 18px rgba(14,165,212,0.35);
        }
        .vrm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14,165,212,0.45);
        }
        .vrm-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        .vrm-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2.4s linear infinite;
        }

        /* ── fade-up stagger ── */
        .fu1 { animation: fadeSlideUp 0.45s ease both 0.05s; }
        .fu2 { animation: fadeSlideUp 0.45s ease both 0.12s; }
        .fu3 { animation: fadeSlideUp 0.45s ease both 0.19s; }
        .fu4 { animation: fadeSlideUp 0.45s ease both 0.26s; }
        .fu5 { animation: fadeSlideUp 0.45s ease both 0.33s; }
        .fu6 { animation: fadeSlideUp 0.45s ease both 0.40s; }
        .fu7 { animation: fadeSlideUp 0.45s ease both 0.47s; }
        .fu8 { animation: fadeSlideUp 0.45s ease both 0.54s; }
      `}</style>

      {/* ══════════════════════════════════
          LEFT PANEL — Register Form
      ══════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: "40px 32px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* ── Header ── */}
          <div className="fu1" style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(14,165,212,0.10)",
                border: "1px solid rgba(14,165,212,0.2)",
                borderRadius: "30px",
                padding: "5px 14px",
                marginBottom: "16px",
              }}
            >
              <span style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#0ea5d4", boxShadow: "0 0 6px #0ea5d4",
                display: "inline-block",
              }} />
              <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#0ea5d4", letterSpacing: "0.06em" }}>
                NEW ACCOUNT
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "30px",
                fontWeight: 800,
                color: "#0d1f33",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                margin: "0 0 7px",
              }}
            >
              Create your account
            </h1>
            <p style={{ fontSize: "13.5px", color: "rgba(0,0,0,0.4)", margin: 0, lineHeight: 1.6 }}>
              Join VRM Transport and manage your fleet today
            </p>
          </div>

          {/* ── Form Fields ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Full Name */}
            <div className="fu2">
              <label className="vrm-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "13px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px", pointerEvents: "none",
                }}>👤</span>
                <input
                  type="text"
                  className="vrm-input"
                  placeholder="Owner User"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="fu3">
              <label className="vrm-label">Mobile Number</label>
              <div style={{ position: "relative" }}>
                {/* Country prefix */}
                <div style={{
                  position: "absolute", left: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", gap: "6px",
                  borderRight: "1.5px solid rgba(0,0,0,0.10)",
                  paddingRight: "10px",
                  pointerEvents: "none",
                }}>
                  <span style={{ fontSize: "14px" }}>🇮🇳</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>+91</span>
                </div>
                <input
                  type="tel"
                  className="vrm-input"
                  placeholder="9999999999"
                  maxLength={10}
                  value={form.mobile}
                  onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))}
                  style={{ paddingLeft: "74px" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="fu4">
              <label className="vrm-label">Password</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "13px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "15px", pointerEvents: "none",
                }}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  className="vrm-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  style={{ paddingLeft: "40px", paddingRight: "44px" }}
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(0,0,0,0.32)", fontSize: "14px", padding: "4px", lineHeight: 1,
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: "3px", borderRadius: "4px",
                          background: i <= passwordStrength ? strengthColor : "rgba(0,0,0,0.08)",
                          transition: "background 0.25s ease",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", color: strengthColor, fontWeight: 600, margin: 0 }}>
                    {strengthLabel} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="fu5">
              <label className="vrm-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "13px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "15px", pointerEvents: "none",
                }}>🔐</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="vrm-input"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={e => set("confirmPassword", e.target.value)}
                  style={{
                    paddingLeft: "40px",
                    paddingRight: "44px",
                    borderColor: form.confirmPassword
                      ? form.confirmPassword === form.password
                        ? "rgba(34,197,94,0.5)"
                        : "rgba(239,68,68,0.45)"
                      : undefined,
                  }}
                />
                <button
                  onClick={() => setShowConfirm(p => !p)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(0,0,0,0.32)", fontSize: "14px", padding: "4px", lineHeight: 1,
                  }}
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
                {form.confirmPassword && (
                  <span style={{
                    position: "absolute", right: "40px", top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                  }}>
                    {form.confirmPassword === form.password ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>

            {/* Role Selector */}
            <div className="fu6">
              <label className="vrm-label">Account Role</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {roles.map(r => (
                  <div
                    key={r.value}
                    className={`role-card${form.role === r.value ? " selected" : ""}`}
                    onClick={() => set("role", r.value)}
                  >
                    <div style={{ fontSize: "18px", marginBottom: "4px" }}>{r.icon}</div>
                    <p style={{
                      fontSize: "11.5px", fontWeight: 700,
                      color: form.role === r.value ? "#0ea5d4" : "#1a1a1a",
                      margin: "0 0 2px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {r.label}
                    </p>
                    <p style={{
                      fontSize: "9.5px", color: "rgba(0,0,0,0.38)",
                      margin: 0, lineHeight: 1.3,
                    }}>
                      {r.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="fu7" style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div
                onClick={() => setAgreed(a => !a)}
                style={{
                  width: "18px", height: "18px", minWidth: "18px",
                  borderRadius: "5px",
                  border: agreed ? "none" : "1.5px solid rgba(14,165,212,0.4)",
                  background: agreed
                    ? "linear-gradient(135deg, #0ea5d4, #1e3a5f)"
                    : "rgba(14,165,212,0.06)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.18s ease",
                  marginTop: "1px",
                  flexShrink: 0,
                }}
              >
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.48)", lineHeight: 1.6, margin: 0 }}>
                I agree to VRM Transport's{" "}
                <Link href="#" style={{ color: "#0ea5d4", fontWeight: 600, textDecoration: "none" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" style={{ color: "#0ea5d4", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>
              </p>
            </div>

            {/* Submit */}
            <div className="fu8">
              <button
                className="vrm-btn"
                onClick={handleSubmit}
                disabled={loading || !agreed}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.7s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>
            </div>

            {/* Login link */}
            <p className="fu8" style={{ textAlign: "center", fontSize: "13px", color: "rgba(0,0,0,0.4)", margin: 0 }}>
              Already have an account?{" "}
              <Link
                href="/login"
                style={{ color: "#0ea5d4", fontWeight: 700, textDecoration: "none" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT PANEL — Brand Visual
      ══════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 44%",
          background: "linear-gradient(145deg, #0d1f33 0%, #0a2a45 55%, #0d1f33 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 44px",
        }}
      >
        {/* grid bg */}
        <div className="vrm-grid-bg" />

        {/* radial glow */}
        <div style={{
          position: "absolute", top: "45%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "480px", height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,212,0.16) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* ── Logo ── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Image
            src={logo}
            alt="VRM Transport"
            style={{
              height: "42px", width: "auto", objectFit: "contain",
              filter: "brightness(1.1) drop-shadow(0 0 12px rgba(14,165,212,0.5))",
            }}
          />
        </div>

        {/* ── Orbit Graphic ── */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "36px" }}>
          <div style={{ position: "relative", width: "260px", height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* Orbit rings */}
            {[148, 110, 75].map((r, i) => (
              <svg
                key={r}
                width={r * 2 + 20}
                height={r * 2 + 20}
                viewBox={`0 0 ${r * 2 + 20} ${r * 2 + 20}`}
                style={{ position: "absolute" }}
              >
                <circle
                  cx={r + 10}
                  cy={r + 10}
                  r={r}
                  fill="none"
                  stroke={`rgba(14,165,212,${0.12 - i * 0.02})`}
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "6 6" : i === 1 ? "4 8" : "none"}
                />
              </svg>
            ))}

            {/* Center hub */}
            <div style={{
              width: "64px", height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #0ea5d4 0%, #1e3a5f 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 28px rgba(14,165,212,0.45)",
              fontSize: "28px",
              animation: "pulse 3s ease-in-out infinite",
              zIndex: 1,
            }}>
              🚛
            </div>

            {/* Orbiting nodes */}
            {[
              { anim: "orbitA", emoji: "📦", label: "Cargo" },
              { anim: "orbitB", emoji: "🗺️", label: "Routes" },
              { anim: "orbitC", emoji: "⚡", label: "Live" },
            ].map(node => (
              <div
                key={node.anim}
                style={{
                  position: "absolute",
                  animation: `${node.anim} ${node.anim === "orbitA" ? "8s" : node.anim === "orbitB" ? "5.5s" : "11s"} linear infinite`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
                }}
              >
                <div style={{
                  width: "38px", height: "38px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(14,165,212,0.25)",
                  backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                }}>
                  {node.emoji}
                </div>
              </div>
            ))}
          </div>

          {/* Text block */}
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "26px", fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              margin: "0 0 12px",
            }}>
              Join our network.<br />
              <span style={{ color: "#0ea5d4" }}>Scale your fleet.</span>
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>
              Register to get access to real-time tracking,<br />
              route optimization & smart fleet analytics.
            </p>
          </div>

          {/* Feature checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {[
              "Real-time GPS tracking for all vehicles",
              "Automated delivery scheduling & dispatch",
              "Analytics dashboard with live insights",
              "Role-based multi-user access control",
            ].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", minWidth: "20px",
                  borderRadius: "6px",
                  background: "rgba(14,165,212,0.15)",
                  border: "1px solid rgba(14,165,212,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0ea5d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom trust badges ── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            display: "flex", gap: "10px",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            backdropFilter: "blur(8px)",
          }}>
            {[
              { icon: "🔒", label: "256-bit Encryption" },
              { icon: "🌐", label: "99.9% Uptime SLA" },
              { icon: "⚡", label: "Instant Setup" },
            ].map(b => (
              <div key={b.label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{b.icon}</div>
                <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 600, letterSpacing: "0.04em" }}>
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