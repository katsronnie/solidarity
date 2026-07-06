import React from "react";
import { Info } from "lucide-react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { ALLOCATION, SAVINGS_BY_TYPE, RATE, NOTIFICATIONS, fmt } from "./lib/data";

export default function HealthFundPage({ onNavigate }) {
  const total = ALLOCATION.reduce((s, a) => s + a.value, 0);
  let cumulative = 0;
  const segs = ALLOCATION.map((a) => {
    const start = (cumulative / total) * 100;
    cumulative += a.value;
    const end = (cumulative / total) * 100;
    return { ...a, start, end };
  });
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeader title="Fund" unreadCount={unread} onNavigate={onNavigate} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5 flex flex-col items-center">
          <SectionLabel>How your balance is reserved</SectionLabel>
          <svg width="180" height="180" viewBox="0 0 180 180">
            {segs.map((s, i) => {
              const r = 74, cx = 90, cy = 90, c = 2 * Math.PI * r;
              const dash = ((s.end - s.start) / 100) * c;
              const gap = c - dash;
              const rotate = (s.start / 100) * 360 - 90;
              return (
                <circle
                  key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="20"
                  strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rotate} ${cx} ${cy})`}
                />
              );
            })}
            <text x="90" y="86" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="15" fontWeight="600" fill="#14231F">
              {fmt(total).replace("UGX ", "")}
            </text>
            <text x="90" y="104" textAnchor="middle" fontFamily="Manrope" fontSize="9.5" fontWeight="700" fill="#8A9690">
              UGX RESERVED
            </text>
          </svg>

          <div className="w-full mt-5 flex flex-col gap-3">
            {ALLOCATION.map((a) => {
              const Icon = a.icon;
              const pct = Math.round((a.value / total) * 100);
              return (
                <div key={a.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: a.color + "1A" }}>
                    <Icon size={15} color={a.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{a.label}</p>
                      <p className="text-[12px]" style={{ color: "#14231F", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(a.value)}</p>
                    </div>
                    <div className="w-full h-1.5 rounded-full mt-1.5" style={{ background: "#F0ECE0" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: a.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <div>
            <SectionLabel>Savings by transaction type</SectionLabel>
            <Card className="p-4">
              <div className="w-full h-3 rounded-full overflow-hidden flex mb-4" style={{ background: "#F0ECE0" }}>
                {SAVINGS_BY_TYPE.map((s) => (
                  <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SAVINGS_BY_TYPE.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-[12px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 600 }}>{s.label}</span>
                    <span className="text-[11.5px] ml-auto" style={{ color: "#8A9690", fontFamily: "IBM Plex Mono" }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("withdraw")}
            className="rounded-[16px] px-4 py-3.5 flex items-center justify-between"
            style={{ background: "#0E4B43" }}
          >
            <span style={{ color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>
              Request a withdrawal
            </span>
            <span style={{ color: "#F5B942", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>→</span>
          </button>

          <div className="rounded-[16px] px-4 py-3 flex items-start gap-3" style={{ background: "#FFF6E9", border: "1px solid #F1DCA8" }}>
            <Info size={16} color="#B57A17" className="mt-0.5 shrink-0" />
            <p className="text-[11.5px] leading-snug" style={{ color: "#7A5615", fontFamily: "Manrope", fontWeight: 600 }}>
              Every transaction across MTN and Airtel — airtime, data, sending, withdrawing — sets aside {RATE}% automatically into this fund. Nothing to remember, nothing to top up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
