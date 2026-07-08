import React, { useState } from "react";
import { AdminCard, AdminPageHeader, Badge } from "./components/admin-ui";
import { ALL_TRANSACTIONS, fmt } from "./lib/adminData";

export default function AdminTransactions() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Airtime", "Send money", "Data bundle", "Withdraw"];
  const filtered = ALL_TRANSACTIONS.filter((t) => (filter === "All" ? true : t.type === filter));

  return (
    <div>
      <AdminPageHeader title="Transactions" subtitle="Live feed of savings deductions across every user" />

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {types.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="px-3.5 py-1.5 rounded-full text-[12px] shrink-0"
              style={{
                background: active ? "#16294D" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#5B6472",
                border: "1px solid " + (active ? "#16294D" : "#E4E7EC"),
                fontFamily: "Manrope",
                fontWeight: 700,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <AdminCard className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr_1.2fr] gap-2 px-4 py-3" style={{ background: "#F9FAFB", borderBottom: "1px solid #E4E7EC" }}>
          {["User", "Type", "Network", "Amount", "Saved (8%)", "Time"].map((h) => (
            <span key={h} className="text-[10.5px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {filtered.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr_1.2fr] gap-2 px-4 py-3.5 items-center"
            style={{ borderTop: "1px solid #EEF0F2" }}
          >
            <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{t.user}</p>
            <span className="text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 600 }}>{t.type}</span>
            <span className="hidden md:block"><Badge variant={t.network.toLowerCase()}>{t.network}</Badge></span>
            <span className="text-[12.5px]" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(t.amount)}</span>
            <span className="text-[12px]" style={{ color: "#1F9D63", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>+{fmt(t.saved)}</span>
            <span className="hidden md:block text-[11.5px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>{t.time}</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>No transactions of this type yet.</p>
        )}
      </AdminCard>
    </div>
  );
}
