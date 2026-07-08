import React, { useState } from "react";
import { AdminCard, AdminPageHeader, AdminSectionLabel, AdminButton } from "./components/admin-ui";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-10 h-6 rounded-full relative shrink-0 transition-colors"
      style={{ background: checked ? "#16294D" : "#E4E7EC" }}
    >
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: checked ? 18 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

export default function AdminSettings() {
  const [rate, setRate] = useState(8);
  const [ceiling, setCeiling] = useState(500000);
  const [mtnEnabled, setMtnEnabled] = useState(true);
  const [airtelEnabled, setAirtelEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: persist to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <AdminPageHeader title="Settings" subtitle="System-wide configuration — changes apply to every user" />

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div>
          <AdminSectionLabel>Fund parameters</AdminSectionLabel>
          <AdminCard className="p-5 flex flex-col gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Deduction rate (%)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                style={{ border: "1px solid #E4E7EC", fontFamily: "IBM Plex Mono", fontSize: 14, color: "#101828" }}
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Fund ceiling (UGX)
              </label>
              <input
                type="number"
                step={10000}
                value={ceiling}
                onChange={(e) => setCeiling(Number(e.target.value))}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                style={{ border: "1px solid #E4E7EC", fontFamily: "IBM Plex Mono", fontSize: 14, color: "#101828" }}
              />
            </div>
          </AdminCard>
        </div>

        <div>
          <AdminSectionLabel>Network availability</AdminSectionLabel>
          <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>MTN Mobile Money</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Accept deductions from MTN transactions</p>
              </div>
              <Toggle checked={mtnEnabled} onChange={setMtnEnabled} />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #EEF0F2" }}>
              <div>
                <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>Airtel Money</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Accept deductions from Airtel transactions</p>
              </div>
              <Toggle checked={airtelEnabled} onChange={setAirtelEnabled} />
            </div>
          </AdminCard>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton variant="primary" type="submit">Save changes</AdminButton>
          {saved && (
            <span className="text-[11.5px]" style={{ color: "#1F9D63", fontFamily: "Manrope", fontWeight: 700 }}>
              Saved ✓
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
