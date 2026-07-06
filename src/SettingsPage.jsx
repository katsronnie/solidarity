import React, { useState } from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { USER, RATE, CEILING, fmt } from "./lib/data";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-10 h-6 rounded-full relative shrink-0 transition-colors"
      style={{ background: checked ? "#0E4B43" : "#E5DFD0" }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: checked ? 18 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
      />
    </button>
  );
}

export default function SettingsPage({ onNavigate }) {
  const [notifTxn, setNotifTxn] = useState(true);
  const [notifMilestones, setNotifMilestones] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <div>
      <PageHeader title="Settings" onNavigate={onNavigate} />

      <div className="flex flex-col gap-6">
        <div>
          <SectionLabel>Fund settings</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <Row label="Deduction rate" value={`${RATE}% per transaction`} />
            <Row label="Fund ceiling" value={fmt(CEILING)} />
            <Row label="Linked network" value="MTN & Airtel" />
          </Card>
        </div>

        <div>
          <SectionLabel>Notifications</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <ToggleRow label="Transaction alerts" sub="Every time a saving is added" checked={notifTxn} onChange={setNotifTxn} />
            <ToggleRow label="Milestone alerts" sub="Ceiling progress & best months" checked={notifMilestones} onChange={setNotifMilestones} />
          </Card>
        </div>

        <div>
          <SectionLabel>Security</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <ToggleRow label="Biometric login" sub="Use fingerprint or face unlock" checked={biometric} onChange={setBiometric} />
          </Card>
        </div>

        <div>
          <SectionLabel>Account</SectionLabel>
          <Card className="p-4">
            <p className="text-[12.5px]" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>
              Signed in as <strong style={{ color: "#14231F" }}>{USER.name}</strong> · {USER.network}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #EFEBE0" }}>
      <span className="text-[12.5px]" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 600 }}>{label}</span>
      <span className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #EFEBE0" }}>
      <div>
        <p className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 500 }}>{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
