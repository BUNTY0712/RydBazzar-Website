"use client"

import { useEffect, useRef, useState } from "react"
import {
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  Car,
  Shield,
  MoreHorizontal,
  Search,
  Download,
} from "lucide-react"

// ── TYPES ─────────────────────────────────────────────────────────────────────

type TagColor = "blue" | "green" | "amber" | "red"

interface ReviewTag {
  label: string
  color: TagColor
}

interface Review {
  name: string
  avatar: string
  rating: number
  date: string
  text: string
  tags: ReviewTag[]
}

type FilterValue = "all" | 5 | 4 | 3

// ── DATA ──────────────────────────────────────────────────────────────────────

const statCards = [
  {
    icon: <Star size={17} />,
    value: "4.9",
    label: "Overall Rating",
    sub: "Based on 318 reviews",
  },
  {
    icon: <MessageSquare size={17} />,
    value: "318",
    label: "Total Reviews",
    sub: "All time",
  },
  {
    icon: <TrendingUp size={17} />,
    value: "96%",
    label: "Positive Rate",
    sub: "4★ and above",
  },
  {
    icon: <Clock size={17} />,
    value: "2.1d",
    label: "Avg Response",
    sub: "To feedback",
  },
]

const ratingData = [
  { star: 5, count: 240, pct: 76 },
  { star: 4, count: 64,  pct: 20 },
  { star: 3, count: 10,  pct: 3  },
  { star: 2, count: 3,   pct: 1  },
  { star: 1, count: 1,   pct: 0  },
]

const topMentions: { label: string; count: number; color: TagColor }[] = [
  { label: "Punctual",    count: 187, color: "blue"  },
  { label: "Polite",      count: 142, color: "green" },
  { label: "Safe driver", count: 118, color: "green" },
  { label: "Clean car",   count: 95,  color: "amber" },
  { label: "Late once",   count: 12,  color: "red"   },
]

const reviews: Review[] = [
  {
    name: "Priya S.",
    avatar: "https://i.pravatar.cc/40?u=priya2",
    rating: 5,
    date: "Mar 17, 2026",
    text: "Rahul was absolutely fantastic — arrived 3 minutes early and drove smoothly the entire way. Highly recommend!",
    tags: [{ label: "Punctual", color: "blue" }, { label: "Polite", color: "green" }],
  },
  {
    name: "Arjun K.",
    avatar: "https://i.pravatar.cc/40?u=arjun",
    rating: 5,
    date: "Mar 16, 2026",
    text: "Very professional driver. Car was spotless and he took the best route to avoid traffic.",
    tags: [{ label: "Safe driver", color: "green" }, { label: "Clean car", color: "amber" }],
  },
  {
    name: "Sara M.",
    avatar: "https://i.pravatar.cc/40?u=sara2",
    rating: 4,
    date: "Mar 15, 2026",
    text: "Good ride overall, friendly conversation. Slightly delayed at pickup but communicated well.",
    tags: [{ label: "Polite", color: "green" }],
  },
  {
    name: "Dev R.",
    avatar: "https://i.pravatar.cc/40?u=dev",
    rating: 5,
    date: "Mar 14, 2026",
    text: "Best driver I've had on this platform. Would specifically request Rahul again if possible.",
    tags: [{ label: "Punctual", color: "blue" }, { label: "Safe driver", color: "green" }],
  },
  {
    name: "Neha T.",
    avatar: "https://i.pravatar.cc/40?u=neha",
    rating: 3,
    date: "Mar 13, 2026",
    text: "Ride was okay. Took a slightly longer route but was polite throughout the journey.",
    tags: [{ label: "Polite", color: "green" }],
  },
  {
    name: "James O.",
    avatar: "https://i.pravatar.cc/40?u=james2",
    rating: 5,
    date: "Mar 12, 2026",
    text: "On time, smooth ride, no complaints at all. Car smelled clean. 5 stars, no question.",
    tags: [{ label: "Punctual", color: "blue" }, { label: "Clean car", color: "amber" }],
  },
]

// ── HELPERS ───────────────────────────────────────────────────────────────────

const tagStyle: Record<TagColor, { bg: string; color: string; border: string }> = {
  blue:  { bg: "rgba(14,165,212,0.08)",  color: "#0369a1", border: "rgba(14,165,212,0.2)"  },
  green: { bg: "rgba(22,163,74,0.07)",   color: "#166534", border: "rgba(22,163,74,0.2)"   },
  amber: { bg: "rgba(245,158,11,0.08)",  color: "#92400e", border: "rgba(245,158,11,0.2)"  },
  red:   { bg: "rgba(239,68,68,0.07)",   color: "#991b1b", border: "rgba(239,68,68,0.18)"  },
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ fontSize: `${size}px`, color: i < rating ? "#f59e0b" : "rgba(0,0,0,0.12)" }}>
          ★
        </span>
      ))}
    </div>
  )
}

function Tag({ label, color }: ReviewTag) {
  const s = tagStyle[color]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: "20px",
        marginRight: "5px",
        marginTop: "6px",
        background: s.bg,
        color: s.color,
        border: `0.5px solid ${s.border}`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </span>
  )
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DriverReview() {
  const rideBarRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")

  // Animate rating bars on mount
  useEffect(() => {
    const t = setTimeout(() => {
      rideBarRefs.current.forEach((el, i) => {
        if (el) el.style.width = `${ratingData[i].pct}%`
      })
    }, 120)
    return () => clearTimeout(t)
  }, [])

  const filteredReviews =
    activeFilter === "all"
      ? reviews
      : activeFilter === 3
      ? reviews.filter((r) => r.rating <= 3)
      : reviews.filter((r) => r.rating === activeFilter)

  const filters: { label: string; value: FilterValue }[] = [
    { label: "All",       value: "all" },
    { label: "5★",        value: 5     },
    { label: "4★",        value: 4     },
    { label: "3★ & below",value: 3     },
  ]

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        color: "#111",
        minHeight: "100%",
        paddingBottom: "28px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --vrm:        #0ea5d4;
          --vrm-dark:   #1e3a5f;
          --vrm-bg:     rgba(14,165,212,0.07);
          --vrm-border: rgba(14,165,212,0.18);
        }
        @keyframes dr-fadeup {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .dr-anim { animation: dr-fadeup .4s ease both; }

        /* stat card */
        .dr-stat {
          background:#fff; border-radius:14px;
          border:.5px solid rgba(0,0,0,.07); padding:18px;
          transition:transform .2s, box-shadow .2s; cursor:default;
          position:relative; overflow:hidden;
        }
        .dr-stat:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.07); }
        .dr-stat::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#0ea5d4,#1e3a5f);
          border-radius:14px 14px 0 0; opacity:0; transition:opacity .2s;
        }
        .dr-stat:hover::before { opacity:1; }

        /* dashboard card */
        .dr-card {
          background:#fff; border-radius:14px;
          border:.5px solid rgba(0,0,0,.07); padding:20px;
        }

        /* rating bar fill */
        .dr-rbar-fill {
          height:100%; border-radius:99px;
          background:linear-gradient(90deg,#f59e0b,#f97316);
          width:0; transition:width .7s ease;
        }

        /* review row hover */
        .dr-review:hover { background:rgba(14,165,212,.04); border-radius:10px; }

        /* profile pills */
        .dr-pill {
          font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px;
          border:.5px solid rgba(0,0,0,.08); color:rgba(0,0,0,.55);
          background:#f9f9f9; display:inline-flex; align-items:center; gap:5px;
        }

        /* filter btn */
        .dr-filter {
          font-size:12px; font-weight:600; padding:5px 13px;
          border-radius:20px; border:.5px solid rgba(0,0,0,.1);
          background:#fff; color:rgba(0,0,0,.5); cursor:pointer;
          font-family:'DM Sans',sans-serif; transition:all .15s;
        }
        .dr-filter:hover, .dr-filter.active {
          background:var(--vrm-bg); color:var(--vrm); border-color:var(--vrm-border);
        }

        /* buttons */
        .dr-btn-primary {
          font-size:12px; font-weight:600; color:#fff;
          background:var(--vrm); border:none; padding:7px 16px;
          border-radius:9px; cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:background .15s; display:flex; align-items:center; gap:6px;
        }
        .dr-btn-primary:hover { background:#0990ba; }
        .dr-btn-secondary {
          font-size:12px; font-weight:600; color:var(--vrm);
          background:var(--vrm-bg); border:none; padding:7px 16px;
          border-radius:9px; cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:background .15s;
        }
        .dr-btn-secondary:hover { background:rgba(14,165,212,.14); }

        /* more btn */
        .dr-more {
          background:none; border:none; cursor:pointer;
          color:rgba(0,0,0,.3); padding:4px 6px; border-radius:6px;
          display:flex; align-items:center; transition:background .15s, color .15s;
        }
        .dr-more:hover { background:var(--vrm-bg); color:var(--vrm); }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div
        className="dr-anim"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          animationDelay: "0ms",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px", fontWeight: 800,
              letterSpacing: "-0.025em", color: "#0f0f0f", lineHeight: 1.2,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Driver Reviews
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)", marginTop: "3px" }}>
            Passenger feedback &amp; ratings
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              fontSize: "12px", fontWeight: 600,
              color: "rgba(0,0,0,0.4)", background: "#f5f5f5",
              border: "0.5px solid rgba(0,0,0,0.08)",
              padding: "5px 13px", borderRadius: "20px",
            }}
          >
            Mar 2026
          </div>
           <button
    style={{
      background: "linear-gradient(135deg, #0ea5d4, #1e3a5f)",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: "0 4px 14px rgba(14,165,212,0.25)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-1px)"
      e.currentTarget.style.boxShadow = "0 6px 18px rgba(14,165,212,0.35)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)"
      e.currentTarget.style.boxShadow = "0 4px 14px rgba(14,165,212,0.25)"
    }}
  >
    Export CSV
  </button>
          {/* <button className="dr-btn-primary">
            <Download size={13} /> Export CSV
          </button> */}
        </div>
      </div>

      {/* ── DRIVER PROFILE HEADER ── */}
      <div
        className="dr-card dr-anim"
        style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", animationDelay: "40ms" }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src="https://i.pravatar.cc/80?u=rahul"
            alt="Rahul Mehta"
            style={{
              width: "72px", height: "72px", borderRadius: "16px",
              objectFit: "cover", border: "2px solid rgba(14,165,212,0.18)",
            }}
          />
          <span
            style={{
              position: "absolute", bottom: "4px", right: "4px",
              width: "12px", height: "12px", borderRadius: "50%",
              background: "#22c55e", border: "2px solid #fff",
              display: "block",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0f0f0f" }}>
            Rahul Mehta
          </div>
          <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.4)", marginTop: "3px" }}>
            VRM-4821 · Mumbai Central Zone · Joined Jan 2022
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <span className="dr-pill"><MapPin size={11} /> 1,240 trips</span>
            <span className="dr-pill"><Clock size={11} /> 4.2 yr tenure</span>
            <span className="dr-pill"><Car size={11} /> Toyota Innova</span>
            <span
              className="dr-pill"
              style={{ color: "#16a34a", background: "rgba(22,163,74,0.07)", borderColor: "rgba(22,163,74,0.2)" }}
            >
              <Shield size={11} /> Verified
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", flexShrink: 0 }}>
          <button className="dr-btn-secondary">Message</button>
          <button className="dr-btn-primary">View Profile</button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        {statCards.map((s, i) => (
          <div key={s.label} className="dr-stat dr-anim" style={{ animationDelay: `${80 + i * 50}ms` }}>
            <div
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(14,165,212,0.07)", color: "#0ea5d4",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f0f0f", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: "11.5px", fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "5px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.28)", marginTop: "2px" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "14px" }}>

        {/* RATING BREAKDOWN */}
        <div className="dr-card dr-anim" style={{ animationDelay: "280ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f0f0f" }}>Rating Breakdown</h2>
              <p style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.35)", marginTop: "2px" }}>Distribution of 318 reviews</p>
            </div>
            <Star size={15} color="#0ea5d4" />
          </div>

          {/* Big score */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f0f0f", lineHeight: 1 }}>4.9</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "8px 0 5px" }}>
              {[1, 2, 3, 4].map((i) => (
                <span key={i} style={{ fontSize: "18px", color: "#f59e0b" }}>★</span>
              ))}
              <span style={{ fontSize: "18px", color: "#f59e0b", opacity: 0.55 }}>★</span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.38)" }}>318 total reviews</div>
          </div>

          {/* Bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ratingData.map((r, i) => (
              <div key={r.star} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(0,0,0,0.5)", width: "14px", textAlign: "right", flexShrink: 0 }}>
                  {r.star}
                </span>
                <span style={{ color: "#f59e0b", fontSize: "12px", flexShrink: 0 }}>★</span>
                <div style={{ flex: 1, height: "7px", borderRadius: "99px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div
                    className="dr-rbar-fill"
                    ref={(el) => { rideBarRefs.current[i] = el }}
                    data-w={`${r.pct}%`}
                  />
                </div>
                <span style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.38)", width: "24px", textAlign: "right", flexShrink: 0 }}>
                  {r.count}
                </span>
              </div>
            ))}
          </div>

          {/* Top mentions */}
          <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "11.5px", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              Top mentions
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {topMentions.map((m) => (
                <span
                  key={m.label}
                  style={{
                    fontSize: "11.5px", fontWeight: 600,
                    padding: "4px 11px", borderRadius: "20px",
                    background: tagStyle[m.color].bg,
                    color: tagStyle[m.color].color,
                    border: `0.5px solid ${tagStyle[m.color].border}`,
                  }}
                >
                  {m.label} · {m.count}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="dr-card dr-anim" style={{ animationDelay: "320ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#0f0f0f" }}>Recent Reviews</h2>
              <p style={{ fontSize: "11.5px", color: "rgba(0,0,0,0.35)", marginTop: "2px" }}>Passenger feedback</p>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
            {filters.map((f) => (
              <button
                key={f.label}
                className={`dr-filter${activeFilter === f.value ? " active" : ""}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
            <div
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: "7px",
                background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)",
                borderRadius: "9px", padding: "6px 12px",
                fontSize: "13px", color: "rgba(0,0,0,0.35)",
              }}
            >
              <Search size={13} />
              Search…
            </div>
          </div>

          {/* Review items */}
          <div>
            {filteredReviews.map((r, i) => (
              <div
                key={i}
                className="dr-review"
                style={{
                  padding: "16px 8px",
                  borderBottom: i < filteredReviews.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none",
                  transition: "background .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <img
                    src={r.avatar}
                    alt={r.name}
                    style={{ width: "32px", height: "32px", borderRadius: "9px", objectFit: "cover", flexShrink: 0, border: "0.5px solid rgba(0,0,0,0.08)" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f0f0f" }}>{r.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.32)", marginTop: "1px" }}>{r.date}</div>
                  </div>
                  <StarRow rating={r.rating} size={13} />
                  <button className="dr-more"><MoreHorizontal size={15} /></button>
                </div>

                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>{r.text}</p>

                <div style={{ marginTop: "2px" }}>
                  {r.tags.map((t) => (
                    <Tag key={t.label} {...t} />
                  ))}
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(0,0,0,0.3)", fontSize: "13px" }}>
                No reviews for this filter.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}