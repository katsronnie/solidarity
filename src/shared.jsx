import React from "react";
import { Home, Clock, PiggyBank, Bell, User, Settings, LogOut } from "lucide-react";
import { USER } from "./lib/data";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

/* Primary nav — mirrors dashboard/transactions/health-fund/notifications/profile
   ids already used in App.jsx's currentPage state. */
const NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "transactions", label: "Activity", icon: Clock },
  { id: "health-fund", label: "Fund", icon: PiggyBank },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

/**
 * PageContainer
 * Props: currentPage, onNavigate, onLogout, hideSidebar, children
 *
 * Note: `hideSidebar` is accepted for backward compatibility but ignored —
 * in the new design the nav (sidebar on desktop / bottom bar on mobile) is
 * always present so navigation is consistent across every page.
 */
export function PageContainer({ currentPage, onNavigate, onLogout, children }) {
  return (
    <div className="min-h-screen w-full" style={{ background: "#EDE8DB" }}>
      <style>{FONT_IMPORT}</style>

      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="md:pl-60">
        <main className="max-w-3xl mx-auto px-5 md:px-10 pt-6 md:pt-10 pb-32 md:pb-16" style={{ minHeight: "100vh" }}>
          {children}
        </main>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}

function Sidebar({ currentPage, onNavigate, onLogout }) {
  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col justify-between px-4 py-6 z-30"
      style={{ background: "#14231F" }}
    >
      <div>
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "#0E4B43" }}>
            <PiggyBank size={17} color="#F5B942" />
          </div>
          <p style={{ color: "#FFFFFF", fontFamily: "Fraunces", fontWeight: 600, fontSize: 16 }}>Afya Fund</p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-colors text-left"
                style={{ background: active ? "#0E4B43" : "transparent" }}
              >
                <Icon size={17} color={active ? "#F5B942" : "#8A9690"} strokeWidth={active ? 2.4 : 2} />
                <span style={{ color: active ? "#FFFFFF" : "#8A9690", fontFamily: "Manrope", fontWeight: active ? 700 : 500, fontSize: 13.5 }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-colors text-left mt-1"
            style={{ background: currentPage === "settings" ? "#0E4B43" : "transparent" }}
          >
            <Settings size={17} color={currentPage === "settings" ? "#F5B942" : "#8A9690"} />
            <span style={{ color: currentPage === "settings" ? "#FFFFFF" : "#8A9690", fontFamily: "Manrope", fontWeight: currentPage === "settings" ? 700 : 500, fontSize: 13.5 }}>
              Settings
            </span>
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[14px]" style={{ background: "#1B2A25" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[12px]" style={{ background: "#0E4B43", color: "#F5B942", fontFamily: "Fraunces", fontWeight: 600 }}>
            NA
          </div>
          <div className="min-w-0">
            <p className="truncate" style={{ color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, fontSize: 12.5 }}>{USER.name}</p>
            <p className="truncate" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 600, fontSize: 11 }}>{USER.network}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-[12px] transition-colors"
          style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600, fontSize: 12.5 }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ currentPage, onNavigate }) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 z-30"
      style={{ background: "linear-gradient(180deg, rgba(246,243,236,0) 0%, #F6F3EC 30%)" }}
    >
      <div className="flex items-center justify-between px-2 py-2 rounded-[22px]" style={{ background: "#14231F" }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-[16px] transition-all"
              style={{ background: active ? "#0E4B43" : "transparent" }}
            >
              <Icon size={17} color={active ? "#F5B942" : "#8A9690"} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[9.5px] mt-1" style={{ color: active ? "#FFFFFF" : "#8A9690", fontFamily: "Manrope", fontWeight: active ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
