import React, { useState } from "react";
import { Card, PageHeader, TxnRow } from "./components/ui";
import { TRANSACTIONS, MONTH_SAVED, MONTH_TXNS, NOTIFICATIONS, fmt } from "./lib/data";

export default function TransactionsPage({ onNavigate }) {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Airtime", "Send", "Data"];
  const filtered = TRANSACTIONS.filter((t) => (filter === "All" ? true : t.type === filter.toLowerCase()));
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeader title="Activity" unreadCount={unread} onNavigate={onNavigate} />

      <div className="flex gap-2 mb-5">
        {tabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-3.5 py-1.5 rounded-full text-[12px]"
              style={{
                background: active ? "#0E4B43" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#5C6B64",
                border: "1px solid " + (active ? "#0E4B43" : "#E5DFD0"),
                fontFamily: "Manrope",
                fontWeight: 700,
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <Card className="p-4 mb-5 flex items-center justify-between" style={{ background: "#DCEDE7" }}>
        <div>
          <p className="text-[10.5px] uppercase tracking-wide" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>Saved this month</p>
          <p className="text-[20px] mt-0.5" style={{ color: "#0E4B43", fontFamily: "Fraunces", fontWeight: 600 }}>{fmt(MONTH_SAVED)}</p>
        </div>
        <p className="text-[11px]" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>{MONTH_TXNS} transactions</p>
      </Card>

      <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
        {filtered.map((t) => (
          <TxnRow key={t.id} t={t} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8 text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
            No transactions in this category yet.
          </p>
        )}
      </Card>
    </div>
  );
}
