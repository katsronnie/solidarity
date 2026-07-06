import React from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { USER, RATE, CEILING, NOTIFICATIONS, fmt } from "./lib/data";

export default function ProfilePage({ onNavigate }) {
  const rows = [
    { label: "Linked line", value: "MTN MoMo · •••• 214" },
    { label: "Deduction rate", value: `${RATE}% per transaction` },
    { label: "Fund ceiling", value: fmt(CEILING) },
    { label: "Network", value: "MTN & Airtel" },
  ];
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeader title="Profile" unreadCount={unread} onNavigate={onNavigate} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card className="p-5 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-[18px]"
              style={{ background: "#0E4B43", color: "#F5B942", fontFamily: "Fraunces", fontWeight: 600 }}
            >
              NA
            </div>
            <div>
              <p className="text-[15px]" style={{ color: "#14231F", fontFamily: "Fraunces", fontWeight: 600 }}>{USER.name}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>{USER.network}</p>
            </div>
          </Card>

          <div>
            <SectionLabel>Account details</SectionLabel>
            <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #EFEBE0" }}>
                  <span className="text-[12.5px]" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 600 }}>{r.label}</span>
                  <span className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{r.value}</span>
                </div>
              ))}
            </Card>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("settings")}
            className="rounded-[16px] px-4 py-3.5 flex items-center justify-between"
            style={{ background: "#FFFFFF", border: "1px solid #E5DFD0" }}
          >
            <span style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>Go to Settings</span>
            <span style={{ color: "#0E4B43", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>→</span>
          </button>
        </div>

        <div>
          <SectionLabel>How it works</SectionLabel>
          <Card className="p-4 flex flex-col gap-3">
            {[
              "Every airtime top-up, bundle, send, or withdrawal on MTN or Airtel is scanned automatically.",
              `${RATE}% of each transaction's value is set aside into your protected health fund — instantly.`,
              "The balance can only be drawn for consultations, medicine, lab tests, or verified emergencies.",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                  style={{ background: "#DCEDE7", color: "#0E4B43", fontFamily: "IBM Plex Mono", fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <p className="text-[12px] leading-relaxed" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>{t}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
