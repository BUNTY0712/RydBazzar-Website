"use client"

import { MoreHorizontal, Trophy, Star, Car, DollarSign } from "lucide-react"
import { useEffect, useRef } from "react"

// ── DATA ──────────────────────────────────────────────────────────────────────

const stats = [
  { icon: <Trophy size={18} />,    label: "Top Driver",   value: "Rahul M.",  sub: "Highest earnings this week" },
  { icon: <Star size={18} />,      label: "Avg Rating",   value: "4.8",       sub: "Across all active drivers"  },
  { icon: <Car size={18} />,       label: "Total Rides",  value: "12,340",    sub: "Completed this week"        },
  { icon: <DollarSign size={18} />,label: "Revenue",      value: "$24,120",   sub: "Gross this week"            },
]

const performance = [
  { day: "Mon", value: 60, rides: 1840 },
  { day: "Tue", value: 80, rides: 2210 },
  { day: "Wed", value: 55, rides: 1620 },
  { day: "Thu", value: 90, rides: 2460 },
  { day: "Fri", value: 70, rides: 1975 },
  { day: "Sat", value: 50, rides: 1390 },
  { day: "Sun", value: 40, rides: 1100 },
]

const drivers = [
  { name: "Priya Sharma", rides: 150, earnings: "$3,020", rating: 4.8 },
  { name: "Rahul Mehta",  rides: 120, earnings: "$2,340", rating: 4.9 },
  { name: "Amit Das",     rides: 80,  earnings: "$1,120", rating: 4.5 },
]

const maxRides = Math.max(...drivers.map((d) => d.rides))

const rankStyle: Record<number, { bg: string; color: string }> = {
  0: { bg: "rgba(245,158,11,0.12)",  color: "#b45309" },
  1: { bg: "rgba(148,163,184,0.12)", color: "#64748b" },
  2: { bg: "rgba(180,136,99,0.1)",   color: "#92400e" },
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DriverPerformance() {
  const barsRef = useRef<HTMLDivElement[]>([])
  const rideBarRefs = useRef<HTMLDivElement[]>([])

  // Animate bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      barsRef.current.forEach((el, i) => {
        if (el) {
          setTimeout(() => {
            el.style.height = `${performance[i].value}%`
          }, i * 70)
        }
      })
      rideBarRefs.current.forEach((el, i) => {
        if (el) {
          setTimeout(() => {
            el.style.width = `${Math.round((drivers[i].rides / maxRides) * 100)}%`
          }, 200 + i * 60)
        }
      })
    }, 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#111",
        minHeight: "100%",
        paddingBottom: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --vrm-primary:       #0ea5d4;
          --vrm-primary-dark:  #1e3a5f;
          --vrm-accent-bg:     rgba(14,165,212,0.07);
          --vrm-accent-border: rgba(14,165,212,0.18);
        }

        /* ── Stat card ── */
        .dp-stat-card {
          background: #fff;
          border-radius: 14px;
          border: 0.5px solid rgba(0,0,0,0.07);
          padding: 18px;
          position: relative;
          overflow: hidden;
          transition: transform .2s ease, box-shadow .2s ease;
          cursor: default;
          animation: dp-fadeup .4s ease both;
        }
        .dp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.08); }
        .dp-stat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0ea5d4, #1e3a5f);
          border-radius: 14px 14px 0 0;
          opacity: 0;
          transition: opacity .2s;
        }
        .dp-stat-card:hover::before { opacity: 1; }

        /* ── Dashboard card ── */
        .dp-card {
          background: #fff;
          border-radius: 14px;
          border: 0.5px solid rgba(0,0,0,0.07);
          padding: 20px;
          animation: dp-fadeup .4s ease both;
        }

        /* ── Bar chart ── */
        .dp-bar {
          width: 100%;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #0ea5d4 0%, #1e3a5f 100%);
          transition: background .2s;
          cursor: pointer;
          position: relative;
        }
        .dp-bar:hover { background: linear-gradient(180deg, #38bdf8 0%, #0ea5d4 100%); }
        .dp-bar-tooltip {
          display: none;
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%; transform: translateX(-50%);
          background: #1e3a5f;
          color: #fff;
          font-size: 11px; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          font-family: 'DM Sans', sans-serif;
          z-index: 10;
        }
        .dp-bar:hover .dp-bar-tooltip { display: block; }

        /* ── Table ── */
        .dp-table-row:hover { background: var(--vrm-accent-bg); }

        /* ── Ride progress bar ── */
        .dp-ride-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #0ea5d4, #1e3a5f);
          width: 0;
          transition: width .6s ease;
        }

        /* ── Live pulse ── */
        @keyframes dp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(.8); }
        }
        .dp-live-dot { animation: dp-pulse 2s ease-in-out infinite; }

        /* ── Fade-up entry ── */
        @keyframes dp-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── View All button ── */
        .dp-view-all {
          font-size: 12px; font-weight: 600;
          color: #0ea5d4;
          background: var(--vrm-accent-bg);
          border: none;
          padding: 5px 13px; border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .15s;
        }
        .dp-view-all:hover { background: rgba(14,165,212,0.14); }

        /* ── More button ── */
        .dp-more-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(0,0,0,0.3); padding: 4px 6px;
          border-radius: 6px; display: flex; align-items: center;
          transition: background .15s, color .15s;
        }
        .dp-more-btn:hover { background: var(--vrm-accent-bg); color: #0ea5d4; }
      `}</style>

      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          animation: "dp-fadeup .4s ease both",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              color: "#0f0f0f",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Driver Performance
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)", marginTop: "3px" }}>
            Analytics for the current week · Mar 11 – 17, 2026
          </p>
        </div>

        {/* Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#0ea5d4",
            background: "rgba(14,165,212,0.07)",
            border: "1px solid rgba(14,165,212,0.18)",
            padding: "5px 14px",
            borderRadius: "20px",
          }}
        >
          <span
            className="dp-live-dot"
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#0ea5d4",
            }}
          />
          Live
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="dp-stat-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(14,165,212,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0ea5d4",
                marginBottom: "14px",
              }}
            >
              {s.icon}
            </div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "#0f0f0f",
                marginBottom: "5px",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(0,0,0,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.28)", marginTop: "2px" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── CHART + TABLE ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
        }}
      >
        {/* BAR CHART */}
        <div className="dp-card" style={{ animationDelay: "240ms" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f0f0f" }}>
                Weekly Performance
              </h2>
              <p style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.35)", marginTop: "2px" }}>
                Rides completed per day
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "3px",
                  background: "#0ea5d4",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.35)" }}>Rides</span>
            </div>
          </div>

          {/* Bars */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              height: "160px",
            }}
          >
            {performance.map((p, i) => (
              <div
                key={p.day}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  height: "100%",
                }}
              >
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div
                    className="dp-bar"
                    ref={(el) => { if (el) barsRef.current[i] = el }}
                    style={{
                      height: "0",
                      transition: `height .7s cubic-bezier(.34,1.56,.64,1) ${i * 70}ms`,
                    }}
                  >
                    <div className="dp-bar-tooltip">
                      {p.rides.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.38)",
                  }}
                >
                  {p.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP DRIVERS TABLE */}
        <div className="dp-card" style={{ animationDelay: "300ms" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f0f0f" }}>
                Top Drivers
              </h2>
              <p style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.35)", marginTop: "2px" }}>
                Ranked by earnings
              </p>
            </div>
            <button className="dp-view-all">View All</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
                {["#", "Driver", "Rides", "Earnings", "Rating", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.35)",
                      padding: "0 8px 11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => {
                const pct = Math.round((d.rides / maxRides) * 100)
                const rank = rankStyle[i]
                return (
                  <tr
                    key={d.name}
                    className="dp-table-row"
                    style={{
                      borderBottom:
                        i < drivers.length - 1 ? "0.5px solid rgba(0,0,0,0.04)" : "none",
                      transition: "background .15s",
                    }}
                  >
                    {/* Rank */}
                    <td style={{ padding: "11px 8px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "6px",
                          background: rank.bg,
                          color: rank.color,
                          fontSize: "10.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {i + 1}
                      </div>
                    </td>

                    {/* Driver */}
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={`https://i.pravatar.cc/40?u=${d.name}`}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1.5px solid rgba(14,165,212,0.18)",
                            flexShrink: 0,
                          }}
                          alt={d.name}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#0f0f0f",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.name}
                        </span>
                      </div>
                    </td>

                    {/* Rides + mini progress bar */}
                    <td style={{ padding: "11px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div
                          style={{
                            flex: 1,
                            height: "5px",
                            borderRadius: "99px",
                            background: "rgba(0,0,0,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="dp-ride-fill"
                            ref={(el) => { if (el) rideBarRefs.current[i] = el }}
                            data-w={`${pct}%`}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "rgba(0,0,0,0.5)",
                            minWidth: "24px",
                            textAlign: "right",
                          }}
                        >
                          {d.rides}
                        </span>
                      </div>
                    </td>

                    {/* Earnings */}
                    <td
                      style={{
                        padding: "11px 8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#0f0f0f",
                      }}
                    >
                      {d.earnings}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: "11px 8px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "rgba(245,158,11,0.1)",
                          color: "#b45309",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: "20px",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        <span style={{ color: "#f59e0b", fontSize: "11px" }}>★</span>
                        {d.rating}
                      </span>
                    </td>

                    {/* More */}
                    <td style={{ padding: "11px 8px" }}>
                      <button className="dp-more-btn">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}