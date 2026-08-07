import React, { useEffect, useState } from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { supabase } from "./lib/supabaseClient";

const fmt = (n) => "UGX " + Number(n || 0).toLocaleString("en-UG");

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="w-10 h-6 rounded-full relative shrink-0 transition-colors"
      style={{ background: checked ? "#0E4B43" : "#E5DFD0", opacity: disabled ? 0.6 : 1 }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: checked ? 18 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
      />
    </button>
  );
}

export default function SettingsPage({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [savingField, setSavingField] = useState(null); // which toggle is mid-save

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not signed in."); setLoading(false); return; }
      setUserId(user.id);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) { setError(profileError.message); setLoading(false); return; }

      setProfile(data);
      setLoading(false);
    };
    load();
  }, []);

  // Optimistic update: flip the UI immediately, write to the DB, and roll
  // back if the save actually fails — so toggles feel instant but stay real.
  const updateField = async (field, value) => {
    const previous = profile[field];
    setProfile((p) => ({ ...p, [field]: value }));
    setSavingField(field);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", userId);

    setSavingField(null);

    if (updateError) {
      setProfile((p) => ({ ...p, [field]: previous })); // revert on failure
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" onNavigate={onNavigate} />
        <p className="text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Loading...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <PageHeader title="Settings" onNavigate={onNavigate} />
        <p className="text-[12px]" style={{ color: "#E8604C", fontFamily: "Manrope" }}>Couldn't load settings{error ? `: ${error}` : "."}</p>
      </div>
    );
  }

  const inRecovery = Number(profile.debt_balance) > 0;
  const networkLabel = profile.network === "mtn" ? "MTN" : "Airtel";

  return (
    <div>
      <PageHeader title="Settings" onNavigate={onNavigate} />

      <div className="flex flex-col gap-6">
        <div>
          <SectionLabel>Fund settings</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <Row label="Contribution" value={inRecovery ? `UGX 200–1,000 · ${profile.multiplier}x recovery` : "UGX 200–1,000 (tiered)"} />
            <Row label="Platform fee" value="UGX 20 per save" />
            <Row label="Fund ceiling" value={fmt(profile.ceiling)} />
            <Row label="Linked network" value={networkLabel} />
          </Card>
        </div>

        <div>
          <SectionLabel>Notifications</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <ToggleRow
              label="Transaction alerts" sub="Every time a saving is added"
              checked={profile.notif_txn_alerts}
              onChange={(v) => updateField("notif_txn_alerts", v)}
              disabled={savingField === "notif_txn_alerts"}
            />
            <ToggleRow
              label="Milestone alerts" sub="Ceiling progress & best months"
              checked={profile.notif_milestone_alerts}
              onChange={(v) => updateField("notif_milestone_alerts", v)}
              disabled={savingField === "notif_milestone_alerts"}
            />
          </Card>
        </div>

        <div>
          <SectionLabel>Security</SectionLabel>
          <Card className="divide-y" style={{ borderColor: "#E5DFD0" }}>
            <ToggleRow
              label="Biometric login" sub="Use fingerprint or face unlock"
              checked={profile.biometric_login}
              onChange={(v) => updateField("biometric_login", v)}
              disabled={savingField === "biometric_login"}
            />
          </Card>
        </div>

        <div>
          <SectionLabel>Account</SectionLabel>
          <Card className="p-4">
            <p className="text-[12.5px]" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>
              Signed in as <strong style={{ color: "#14231F" }}>{profile.name}</strong> · {networkLabel}
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

function ToggleRow({ label, sub, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5" style={{ borderTop: "1px solid #EFEBE0" }}>
      <div>
        <p className="text-[12.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 500 }}>{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}