import React, { useEffect, useState } from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { supabase } from "./lib/supabaseClient";

const fmt = (n) => "UGX " + Number(n || 0).toLocaleString("en-UG");

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function maskPhone(phone) {
  // stored as "256759452215" (no plus) -> "+256 759 •••• 215"
  if (!phone) return "—";
  const cc = phone.slice(0, 3);
  const p1 = phone.slice(3, 6);
  const last = phone.slice(-3);
  return `+${cc} ${p1} •••• ${last}`;
}

export default function ProfilePage({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not signed in."); setLoading(false); return; }

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

  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" onNavigate={onNavigate} />
        <p className="text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Loading...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <PageHeader title="Profile" onNavigate={onNavigate} />
        <p className="text-[12px]" style={{ color: "#E8604C", fontFamily: "Manrope" }}>Couldn't load your profile{error ? `: ${error}` : "."}</p>
      </div>
    );
  }

  const inRecovery = Number(profile.debt_balance) > 0;
  const networkLabel = profile.network === "mtn" ? "MTN MoMo" : "Airtel Money";

  const rows = [
    { label: "Linked line", value: `${networkLabel} · ${maskPhone(profile.phone)}` },
    { label: "Contribution", value: inRecovery ? `UGX 200–1,000 · ${profile.multiplier}x recovery` : "UGX 200–1,000 (tiered)" },
    { label: "Fund ceiling", value: fmt(profile.ceiling) },
    { label: "Network", value: profile.network === "mtn" ? "MTN" : "Airtel" },
  ];

  return (
    <div>
      <PageHeader title="Profile" onNavigate={onNavigate} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card className="p-5 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-[18px]"
              style={{ background: "#0E4B43", color: "#F5B942", fontFamily: "Fraunces", fontWeight: 600 }}
            >
              {initials(profile.name)}
            </div>
            <div>
              <p className="text-[15px]" style={{ color: "#14231F", fontFamily: "Fraunces", fontWeight: 600 }}>{profile.name}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>{networkLabel} linked</p>
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
            onClick={() => onNavigate && onNavigate("group")}
            className="rounded-[16px] px-4 py-3.5 flex items-center justify-between"
            style={{ background: "#0E4B43" }}
          >
            <span style={{ color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>
              Choose your group
            </span>
            <span style={{ color: "#F5B942", fontFamily: "Manrope", fontWeight: 700, fontSize: 13 }}>→</span>
          </button>

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
              "Every airtime top-up, bundle, send, or MoMo withdrawal is scanned automatically.",
              "Small transactions save a flat UGX 200. Mid-range (10k–50k) save 2%. Larger ones cap at UGX 1,000 — a UGX 20 platform fee applies to each save.",
              "With a group: 70% stays in your personal wallet, 20% goes to your group, 10% to the global pool. Without one: 90% personal, 10% global pool.",
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