import React, { useEffect, useState } from "react";
import { Card, SectionLabel, PageHeader } from "./components/ui";
import { WITHDRAW_REASONS, NOTIFICATIONS, fmt } from "./lib/data";
import { supabase } from "./lib/supabaseClient";

export default function WithdrawPage({ onNavigate }) {
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState("mtn");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(WITHDRAW_REASONS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("balance, network").eq("id", user.id).single();
      if (data) { setBalance(data.balance); setNetwork(data.network); }
    };
    load();
  }, []);

  const numericAmount = Number(amount.replace(/[^0-9]/g, "")) || 0;
  const overLimit = numericAmount > balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numericAmount <= 0 || overLimit) return;

    setBusy(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    const { error: rpcError } = await supabase.rpc("record_yumatta_payout", {
      p_user_id: user.id,
      p_amount: numericAmount,
      p_reason: reason,
      p_network: network,
    });

    setBusy(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setBalance((b) => b - numericAmount);
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setAmount("");
  };

  return (
    <div>
      <PageHeader title="Withdraw" unreadCount={unread} onNavigate={onNavigate} />

      <Card className="p-4 mb-6 flex items-center justify-between" style={{ background: "#DCEDE7" }}>
        <div>
          <p className="text-[10.5px] uppercase tracking-wide" style={{ color: "#3F8F7F", fontFamily: "Manrope", fontWeight: 700 }}>Available balance</p>
          <p className="text-[20px] mt-0.5" style={{ color: "#0E4B43", fontFamily: "Fraunces", fontWeight: 600 }}>{fmt(balance)}</p>
        </div>
      </Card>

      {submitted ? (
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "#DCEDE7" }}>
            <span style={{ color: "#0E4B43", fontSize: 20 }}>✓</span>
          </div>
          <p style={{ color: "#14231F", fontFamily: "Fraunces", fontWeight: 600, fontSize: 16 }}>Withdrawal complete</p>
          <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "#5C6B64", fontFamily: "Manrope", fontWeight: 500 }}>
            {fmt(numericAmount)} for <strong>{reason}</strong> has been withdrawn from your Yumatta savings — no fee, since this is your own money.
          </p>
          <button
            onClick={reset}
            className="mt-5 px-4 py-2 rounded-full text-[12px]"
            style={{ background: "#0E4B43", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700 }}
          >
            Make another withdrawal
          </button>
        </Card>
      ) : (
        <Card className="p-5">
          <SectionLabel>Withdraw from your savings</SectionLabel>
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

            {numericAmount > 0 && !overLimit && (
              <div className="rounded-[12px] p-3 flex items-center justify-between" style={{ background: "#F6F3EC" }}>
                <span className="text-[11.5px]" style={{ color: "#14231F", fontFamily: "Manrope", fontWeight: 700 }}>You'll receive</span>
                <span className="text-[13px]" style={{ color: "#0E4B43", fontFamily: "IBM Plex Mono", fontWeight: 700 }}>{fmt(numericAmount)}</span>
              </div>
            )}

            {error && <p className="text-[11px]" style={{ color: "#E8604C", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>}

            <button
              type="submit"
              disabled={numericAmount <= 0 || overLimit || busy}
              className="mt-1 px-4 py-3 rounded-[14px] text-[13px]"
              style={{
                background: numericAmount > 0 && !overLimit ? "#0E4B43" : "#DCEDE7",
                color: numericAmount > 0 && !overLimit ? "#FFFFFF" : "#8A9690",
                fontFamily: "Manrope",
                fontWeight: 700,
              }}
            >
              {busy ? "Processing..." : "Withdraw"}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}