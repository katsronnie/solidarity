import React, { useState } from "react";
import { AdminCard, AdminPageHeader, AdminSectionLabel, Badge, AdminButton } from "./components/admin-ui";
import { PENDING_PAYOUTS as INITIAL, fmt } from "./lib/adminData";

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState(INITIAL.map((p) => ({ ...p, decision: null })));

  const decide = (id, decision) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, decision } : p)));
  };

  const pending = payouts.filter((p) => !p.decision);
  const decided = payouts.filter((p) => p.decision);

  return (
    <div>
      <AdminPageHeader title="Payouts" subtitle="Review withdrawal and hospital-payment requests before funds move" />

      <AdminSectionLabel right={<span className="text-[11px]" style={{ color: "#B07C0E", fontFamily: "Manrope", fontWeight: 700 }}>{pending.length} awaiting review</span>}>
        Pending
      </AdminSectionLabel>
      <AdminCard className="divide-y mb-6" style={{ borderColor: "#E4E7EC" }}>
        {pending.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-4" style={{ borderTop: "1px solid #EEF0F2" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{p.user}</p>
                <Badge variant="pending">{p.type}</Badge>
              </div>
              <p className="text-[11.5px] mt-1" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 500 }}>
                {p.target} · requested {p.requestedAt}
              </p>
            </div>
            <p className="text-[13px] shrink-0 mr-2" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(p.amount)}</p>
            <div className="flex gap-2 shrink-0">
              <AdminButton variant="success" onClick={() => decide(p.id, "approved")}>Approve</AdminButton>
              <AdminButton variant="danger" onClick={() => decide(p.id, "rejected")}>Reject</AdminButton>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <p className="text-center py-10 text-[12px]" style={{ color: "#5B6472", fontFamily: "Manrope" }}>Nothing waiting for review.</p>
        )}
      </AdminCard>

      {decided.length > 0 && (
        <>
          <AdminSectionLabel>Recently decided</AdminSectionLabel>
          <AdminCard className="divide-y" style={{ borderColor: "#E4E7EC" }}>
            {decided.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3.5" style={{ borderTop: "1px solid #EEF0F2" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px]" style={{ color: "#101828", fontFamily: "Manrope", fontWeight: 700 }}>{p.user}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#5B6472", fontFamily: "Manrope" }}>{p.target}</p>
                </div>
                <p className="text-[12.5px] mr-2" style={{ color: "#101828", fontFamily: "IBM Plex Mono", fontWeight: 600 }}>{fmt(p.amount)}</p>
                <Badge variant={p.decision === "approved" ? "active" : "suspended"}>{p.decision}</Badge>
              </div>
            ))}
          </AdminCard>
        </>
      )}
    </div>
  );
}
