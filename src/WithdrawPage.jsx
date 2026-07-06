import React, { useState } from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { BALANCE, WITHDRAW_REASONS, NOTIFICATIONS, fmt } from "./lib/data";

export default function WithdrawPage({ onNavigate }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(WITHDRAW_REASONS[0]);
  const [submitted, setSubmitted] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  const numericAmount = Number(amount.replace(/[^0-9]/g, "")) || 0;
  const overLimit = numericAmount > BALANCE;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numericAmount > 0 && !overLimit) setSubmitted(true);
  };

  return (
    <div>
      <PageHeader title="Withdraw" unreadCount={unread} onNavigate={onNavigate} />

      <Card className="p-4 mb-6 flex items-center justify-between" style={{ background: "#DCEDE7" }}>
        <div>
          <p className="text-[10.5px] uppercase tracking-wide" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>Available balance</p>
          <p className="text-[20px] mt-0.5" style={{ color: "#0E4B43", fontFamily: "Fraunces", fontWeight: 600 }}>{fmt(BALANCE)}</p>
        </div>
      </Card>

      {submitted ? (
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "#DCEDE7" }}>
            <span style={{ color: "#0E4B43", fontSize: 20 }}>✓</span>
          </div>
          <p style={{ color: "#14231F", fontFamily: "Fraunces", fontWeight: 600, fontSize: 16 }}>Withdrawal requested</p>
          <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>
            UGX {numericAmount.toLocaleString("en-UG")} for <strong>{reason}</strong> is under review. You'll get a notification once it's approved.
          </p>
          <button
            onClick={() => { setSubmitted(false); setAmount(""); }}
            className="mt-5 px-4 py-2 rounded-full text-[12px]"
            style={{ background: "#0E4B43", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700 }}
          >
            Make another request
          </button>
        </Card>
      ) : (
        <Card className="p-5">
          <SectionLabel>Request a withdrawal</SectionLabel>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 700 }}>
                Amount (UGX)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 20,000"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[12px] outline-none"
                style={{
                  border: `1px solid ${overLimit ? "#E8604C" : "#E5DFD0"}`,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 14,
                  color: "#14231F",
                }}
              />
              {overLimit && (
                <p className="mt-1 text-[11px]" style={{ color: "#E8604C", fontFamily: "Manrope", fontWeight: 600 }}>
                  Amount exceeds your available balance.
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 700 }}>
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[12px] outline-none"
                style={{ border: "1px solid #E5DFD0", fontFamily: "Manrope", fontWeight: 600, fontSize: 13, color: "#14231F" }}
              >
                {WITHDRAW_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={numericAmount <= 0 || overLimit}
              className="mt-1 px-4 py-3 rounded-[14px] text-[13px]"
              style={{
                background: numericAmount > 0 && !overLimit ? "#0E4B43" : "#DCEDE7",
                color: numericAmount > 0 && !overLimit ? "#FFFFFF" : "#8A9690",
                fontFamily: "Manrope",
                fontWeight: 700,
              }}
            >
              Submit request
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
