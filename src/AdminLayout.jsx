import React from "react";
import { LayoutGrid, Users, Receipt, Banknote, Building2, PieChart, ShieldCheck, Settings, LogOut, ShieldAlert } from "lucide-react";
import { ADMIN_FONT_IMPORT } from "./components/admin-ui";

const BASE_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "users", label: "Users", icon: Users },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "payouts", label: "Payouts", icon: Banknote },
  { id: "hospitals", label: "Hospitals", icon: Building2 },
  { id: "revenue", label: "Revenue", icon: PieChart },
  { id: "settings", label: "Settings", icon: Settings },
];

const MASTER_ONLY_ITEM = { id: "accounts", label: "Admins", icon: ShieldCheck };

function getNavItems(adminRole) {
  // "Admins" only shows for the master admin — staff never see it at all.
  if (adminRole === "master") {
    const items = [...BASE_NAV_ITEMS];
    items.splice(items.length - 1, 0, MASTER_ONLY_ITEM); // insert before Settings
    return items;
  }
  return BASE_NAV_ITEMS;
}

export default function AdminLayout({ currentPage, onNavigate, onLogout, adminEmail, adminRole, adminName, children }) {
  const navItems = getNavItems(adminRole);

  return (
    <div className="min-h-screen w-full" style={{ background: "#F4F5F7" }}>
      <style>{ADMIN_FONT_IMPORT}</style>

      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        adminEmail={adminEmail}
        adminRole={adminRole}
        adminName={adminName}
        navItems={navItems}
      />

      <div className="md:pl-60">
        <TopBar />
        <main className="max-w-5xl mx-auto px-5 md:px-10 pt-5 pb-32 md:pb-16">
          {children}
        </main>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} navItems={navItems} />
    </div>
  );
}

function TopBar() {
  return (
    <div className="px-5 md:px-10 pt-5 pb-1 flex items-center justify-between md:justify-end">
      <span
        className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]"
        style={{ background: "#16294D", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700 }}
      >
        <ShieldAlert size={11} /> Admin console
      </span>
      <span
        className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px]"
        style={{ background: "#E7F6EE", color: "#1F9D63", fontFamily: "Manrope", fontWeight: 700 }}
      >
        ● Live system
      </span>
    </div>
  );
}

function Sidebar({ currentPage, onNavigate, onLogout, adminEmail, adminRole, adminName, navItems }) {
  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col justify-between px-4 py-6 z-30"
      style={{ background: "#0D1526" }}
    >
      <div>
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "#16294D" }}>
            <ShieldAlert size={16} color="#3B6FE0" />
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 14.5 }}>SHP</p>
            <p style={{ color: "#7C8CA8", fontFamily: "Manrope", fontWeight: 700, fontSize: 10 }}>ADMIN CONSOLE</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors text-left"
                style={{ background: active ? "#16294D" : "transparent" }}
              >
                <Icon size={16} color={active ? "#3B6FE0" : "#7C8CA8"} strokeWidth={active ? 2.4 : 2} />
                <span style={{ color: active ? "#FFFFFF" : "#7C8CA8", fontFamily: "Manrope", fontWeight: active ? 700 : 500, fontSize: 13 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <div className="px-3 py-2.5 rounded-[10px]" style={{ background: "#16294D" }}>
          <p className="truncate" style={{ color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, fontSize: 11.5 }}>
            {adminName || adminEmail}
          </p>
          <p style={{ color: "#3B6FE0", fontFamily: "Manrope", fontWeight: 600, fontSize: 10.5 }}>
            {adminRole === "master" ? "Master Admin" : "Admin"}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-[10px]"
          style={{ color: "#7C8CA8", fontFamily: "Manrope", fontWeight: 600, fontSize: 12 }}
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ currentPage, onNavigate, navItems }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2 z-30" style={{ background: "linear-gradient(180deg, rgba(244,245,247,0) 0%, #F4F5F7 30%)" }}>
      <div className="flex items-center justify-between px-2 py-2 rounded-[18px] overflow-x-auto" style={{ background: "#0D1526" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-[12px] shrink-0 min-w-[54px]"
              style={{ background: active ? "#16294D" : "transparent" }}
            >
              <Icon size={16} color={active ? "#3B6FE0" : "#7C8CA8"} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[9px] mt-1" style={{ color: active ? "#FFFFFF" : "#7C8CA8", fontFamily: "Manrope", fontWeight: active ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}