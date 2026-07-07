"use client"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import logo from "../app/src/assets/Image/vrm_transport.png"  
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  ChevronDown,
  Folder,
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Settings,
  Boxes,
} from "lucide-react"

const menuItems = [
  { icon: <Boxes size={16} />, label: "Personal-Info", href: "/personal-info" },
  { icon: <Boxes size={16} />, label: "All Jobs", href: "/all-jobs" },
  { icon: <Boxes size={16} />, label: "RCTI", href: "/rcti" },
  { icon: <Boxes size={16} />, label: "Leaves", href: "/leaves" },

  


  { icon: <BarChart3 size={16} />, label: "Analytics", href: "#" },
  { icon: <BookOpen size={16} />, label: "Documentation", href: "#" },
  { icon: <Settings size={16} />, label: "Settings", href: "#" },
]

const subMenuItems = [
   { label: "Driver Performance", href: "/drivers-performance" },
  { label: "Active Drivers", href: "/active-drivers" },
  { label: "All Drivers", href: "/all-drivers" },
  { label: "Driver Reviews", href: "/driver-review" },
]


export function AppSidebar() {
  const pathname = usePathname()
  const isHomeActive = subMenuItems.some(item => pathname === item.href)
  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 select-none"
      style={{
        background: "#ffffff",
        boxShadow: "4px 0 24px rgba(0,0,0,0.08), 1px 0 0 rgba(14,165,212,0.12)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── VRM Transport teal/blue palette ── */
        :root {
          --vrm-primary: #0ea5d4;       /* bright teal (logo cyan highlight) */
          --vrm-primary-dark: #1e6fa3;  /* mid steel blue */
          --vrm-deep: #1e3a5f;          /* deep navy (logo dark areas) */
          --vrm-accent-bg: rgba(14,165,212,0.08);
          --vrm-accent-border: rgba(14,165,212,0.2);
          --vrm-accent-label: rgba(14,165,212,0.55);
        }

        .wtm-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(0,0,0,0.55);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }
        .wtm-nav-item:hover, .wtm-nav-item.active {
          color: var(--vrm-deep);
          background: var(--vrm-accent-bg);
        }
        .wtm-nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 55%;
          border-radius: 0 3px 3px 0;
          background: var(--vrm-primary);
          transition: transform 0.2s ease;
        }
        .wtm-nav-item:hover::before, .wtm-nav-item.active::before {
          transform: translateY(-50%) scaleY(1);
        }
        .wtm-icon {
          color: var(--vrm-accent-label);
          flex-shrink: 0;
          transition: color 0.18s ease;
        }
          .wtm-sub-item.active {
  color: var(--vrm-deep);
  background: var(--vrm-accent-bg);
  font-weight: 600;
}
        .wtm-nav-item:hover .wtm-icon,
        .wtm-nav-item.active .wtm-icon {
          color: var(--vrm-primary);
        }
        .wtm-sub-item {
          display: block;
          font-size: 12px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: rgba(0,0,0,0.4);
          padding: 7px 10px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.15s ease;
          letter-spacing: 0.01em;
        }
        .wtm-sub-item:hover {
          color: var(--vrm-deep);
          background: var(--vrm-accent-bg);
        }
        .wtm-divider {
          height: 1px;
          margin: 6px 12px;
          background: linear-gradient(90deg, rgba(14,165,212,0.2), transparent);
        }
        .wtm-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 20px;
          background: rgba(14,165,212,0.12);
          color: var(--vrm-primary);
          letter-spacing: 0.03em;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <SidebarContent className="flex flex-col overflow-hidden">

        {/* ── LOGO HEADER ── */}
        <div
          className="px-4 py-4 flex items-center gap-3"
          style={{
            borderBottom: "1px solid rgba(14,165,212,0.12)",
            background: "linear-gradient(135deg, rgba(14,165,212,0.05) 0%, transparent 70%)",
          }}
        >
          <Image
            src={logo}
            alt="VRM Transport"
            className="h-9 w-auto object-contain"
            style={{
              filter: "brightness(1.05) drop-shadow(0 0 8px rgba(14,165,212,0.3))",
              maxWidth: "160px",
            }}
          />

          <div
            className="h-5 w-px"
            style={{ background: "rgba(14,165,212,0.25)", marginLeft: "2px" }}
          />

          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Admin
          </p>
        </div>

        {/* ── TEAL ACCENT LINE ── */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, #0ea5d4 0%, #1e3a5f 55%, transparent 100%)",
          }}
        />

        {/* ── NAV MENU ── */}
        <SidebarGroup className="px-3 pt-4 flex-1">
          <SidebarGroupLabel
            className="text-xs font-semibold uppercase mb-2 px-3"
            style={{
              color: "rgba(14,165,212,0.6)",
              letterSpacing: "0.12em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Platform
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-0.5">

            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
          <Link
  href="/dashboard"
  className={`wtm-nav-item ${pathname === "/dashboard" ? "active" : ""}`}
>
  <LayoutDashboard size={16} className="wtm-icon" />
  <span>Dashboard</span>
  <span className="wtm-badge">New</span>
</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* HOME DROPDOWN */}
            <Collapsible defaultOpen>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                 <button className={`wtm-nav-item ${isHomeActive ? "active" : ""}`}>
                    <Folder size={16} className="wtm-icon" />
                    <span>Home</span>
                    <ChevronDown
                      size={14}
                      className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180"
                      style={{ color: "rgba(14,165,212,0.55)", marginLeft: "auto" }}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div
                    className="ml-5 mt-1 mb-1 pl-3 space-y-0.5"
                    style={{ borderLeft: "1px solid rgba(14,165,212,0.2)" }}
                  >
                    {subMenuItems.map(item => (
                      <SidebarMenuSubItem key={item.label} style={{ listStyle: "none" }}>
                        <Link
  href={item.href}
  className={`wtm-sub-item ${pathname === item.href ? "active" : ""}`}
>
  {item.label}
</Link>
                      </SidebarMenuSubItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <div className="wtm-divider" />

            {/* Other Items */}
            {menuItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link  className={`wtm-nav-item ${pathname === item.href ? "active" : ""}`} href={item.href} >
                    <span className="wtm-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* ── USER FOOTER ── */}
      <SidebarFooter
        className="p-3"
        style={{
          borderTop: "1px solid rgba(14,165,212,0.12)",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.02)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,165,212,0.06)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-lg object-cover"
              style={{
                border: "1.5px solid rgba(14,165,212,0.35)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 block rounded-full"
              style={{
                width: "8px",
                height: "8px",
                background: "#22c55e",
                boxShadow: "0 0 5px #22c55e",
                border: "1.5px solid #ffffff",
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "rgba(0,0,0,0.8)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Shadcn
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif" }}
            >
              m@example.com
            </p>
          </div>

          {/* 3-dot menu */}
          <div className="flex flex-col gap-[3px] opacity-25 hover:opacity-60 transition-opacity px-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block rounded-full"
                style={{ width: "3px", height: "3px", background: "#0ea5d4" }}
              />
            ))}
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}