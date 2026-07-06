import React from "react";
import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";
import { Card, SectionLabel, PageHeader, PulseRing, TxnRow } from "../components/ui";
import {
  USER, BALANCE, MONTH_SAVED, MONTH_TXNS, CEILING, RATE, PCT,
  MONTHLY, TRANSACTIONS, NOTIFICATIONS, fmt,
} from "../lib/data";

export default function Home() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeader greeting={USER.name} unreadCount={unread} />

      <div className="grid md:grid-cols-[1.1fr_1fr] gap-6">
        <Card
          className="p-6 flex flex-col items-center"
          style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#F9F7F1 100%)" }}
        >
          <PulseRing pct={PCT} balance={BALANCE} monthSaved={MONTH_SAVED} />
          <div className="w-full mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[14px] p-3" style={{ background: "#F6F3EC" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 700 }}>Ceiling</p>
              <p className="text-[14px] mt-0.5" style={{ color: "#14231F", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(CEILING)}</p>
              <p className="text-[10.5px] mt-0.5" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>{PCT}% reached</p>
            </div>
            <div className="rounded-[14px] p-3" style={{ background: "#F6F3EC" }}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 700 }}>Rate per txn</p>
              <p className="text-[14px] mt-0.5" style={{ color: "#14231F", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{RATE}%</p>
              <p className="text-[10.5px] mt-0.5" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600 }}>Auto-deducted</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <div className="rounded-[16px] px-4 py-3 flex items-center gap-3" style={{ background: "#0E4B43" }}>
            <Shield size={18} color="#F5B942" />
            <p className="text-[12px] leading-snug" style={{ color: "#EAF3F0", fontFamily: "Manrope", fontWeight: 600 }}>
              Health emergency fund active — protected & available for treatment or emergencies.
            </p>
          </div>

          <div>
            <SectionLabel right={<span className="text-[11px]" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>{fmt(MONTH_SAVED)} · {MONTH_TXNS} txns</span>}>
              This month
            </SectionLabel>
            <Card className="p-4">
              <div className="flex items-end gap-2 h-24">
                {MONTHLY.map((d) => {
                  const h = (d.v / 7200) * 100;
                  const isBest = d.v === 7200;
                  return (
                    <div key={d.m} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                      <div className="w-full rounded-[6px]" style={{ height: `${h}%`, background: isBest ? "#E8A33D" : "#DCEDE7" }} />
                      <span className="text-[9.5px]" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600 }}>{d.m}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SectionLabel
          right={
            <Link to="/activity" className="text-[11px] flex items-center gap-0.5" style={{ color: "#0E4B43", fontFamily: "Manrope", fontWeight: 700 }}>
              See all <ChevronRight size={12} />
            </Link>
          }
        >
          Recent transactions
        </SectionLabel>
        <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
          {TRANSACTIONS.slice(0, 3).map((t) => (
            <TxnRow key={t.id} t={t} />
          ))}
        </Card>
      </div>
    </div>
  );
}
