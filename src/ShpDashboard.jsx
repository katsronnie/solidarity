import React, { useEffect, useState } from "react";
import {
  Shield,
  ChevronRight,
  User,
  Bell,
  Clock,
  CheckCircle,
  ArrowDownRight,
  Sparkles,
  Zap,
  Heart,
  Activity,
  BarChart3,
  Circle,
  PiggyBank,
  Calendar,
  Target,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { NOTIFICATIONS, fmt } from "./lib/data"; // notifications aren't backed by a real table yet — see note below

const TYPE_LABELS = {
  airtime: "Airtime",
  data: "Data bundle",
  send: "Send money",
  withdraw: "Withdrawal",
  hospital_payment: "Hospital payment",
};

function txnLabel(t) {
  const base = TYPE_LABELS[t.type] || t.type;
  return t.network ? `${base} — ${t.network.toUpperCase()}` : base;
}

function txnDate(t) {
  return new Date(t.created_at).toLocaleString("en-UG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function buildMonthlyTrend(transactions) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, m: d.toLocaleString("en-US", { month: "short" }), v: 0 });
  }
  transactions.forEach((t) => {
    const d = new Date(t.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.v += t.saved;
  });
  return buckets;
}

const StatCard = ({ label, value, subtext, icon: Icon, color, trend, variant = "default" }) => {
  const isCompact = variant === "compact";
  return (
    <div
      className={`rounded-2xl transition-all duration-300 hover:shadow-xl group ${isCompact ? "p-3.5" : "p-4"}`}
      style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${isCompact ? "text-[9px]" : "text-[10px]"} uppercase tracking-wider font-bold`} style={{ color: "#8A9690", fontFamily: "Manrope" }}>{label}</p>
          <p className={`${isCompact ? "text-[16px]" : "text-[18px]"} mt-1 font-bold`} style={{ color: "#14231F", fontFamily: "Space Grotesk", fontWeight: 700 }}>{value}</p>
          {subtext && (
            <div className="flex items-center gap-1 mt-0.5">
              {trend && <span className={`text-[10px] font-bold ${trend > 0 ? "text-[#1F9D63]" : "text-[#E8604C]"}`}>{trend > 0 ? "↑" : "↓"}</span>}
              <p className={`${isCompact ? "text-[9px]" : "text-[10.5px]"} font-medium`} style={{ color: color || "#8A9690", fontFamily: "Manrope" }}>{subtext}</p>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${isCompact ? "p-2" : "p-2.5"} rounded-xl transition-all group-hover:scale-110`} style={{ background: "rgba(14, 75, 67, 0.06)" }}>
            <Icon size={isCompact ? 15 : 18} style={{ color: "#0E4B43" }} />
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationBadge = ({ count }) => {
  if (!count) return null;
  return (
    <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse"
         style={{ background: "linear-gradient(135deg, #E83A3A, #C62828)", color: "#FFFFFF", fontFamily: "Manrope", boxShadow: "0 2px 8px rgba(232, 58, 58, 0.4)" }}>
      {count > 9 ? "9+" : count}
    </div>
  );
};

const ProgressRing = ({ percentage, balance, ceiling, size = 150, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full animate-pulse-slow opacity-20" style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="ringBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#EDE8DB", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "#F6F3EC", stopOpacity: 0.8 }} />
          </linearGradient>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0E4B43" }} />
            <stop offset="50%" style={{ stopColor: "#3F8F7F" }} />
            <stop offset="100%" style={{ stopColor: "#1A5C53" }} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#ringBg)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: "drop-shadow(0 0 15px rgba(63, 143, 127, 0.2))", strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Sparkles size={14} style={{ color: "#F5B942" }} />
        <p className="text-[22px] font-bold" style={{ color: "#14231F", fontFamily: "Space Grotesk", letterSpacing: "-0.5px" }}>{fmt(balance)}</p>
        <p className="text-[10px] font-medium" style={{ color: "#8A9690", fontFamily: "Manrope" }}>of {fmt(ceiling)}</p>
        <div className="mt-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
             style={{ background: "linear-gradient(135deg, rgba(63, 143, 127, 0.12), rgba(14, 75, 67, 0.08))", color: "#0E4B43", fontFamily: "Manrope" }}>
          <Circle size={5} fill="#0E4B43" color="#0E4B43" />
          {percentage}% Complete
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, maxValue }) => {
  const safeMax = maxValue || 1;
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => {
        const h = (d.v / safeMax) * 100;
        const isBest = d.v === safeMax && d.v > 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 group">
            <div className="relative w-full">
              <div
                className="w-full rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                style={{
                  height: `${h}%`,
                  background: isBest ? "linear-gradient(180deg, #F5B942, #E8A33D)" : "linear-gradient(180deg, #DCEDE7, #B8D5CC)",
                  minHeight: "4px",
                  boxShadow: isBest ? "0 4px 16px rgba(245, 185, 66, 0.3)" : "none",
                }}
              >
                {isBest && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Zap size={10} style={{ color: "#E8A33D" }} /></div>}
              </div>
            </div>
            <span className="text-[9px] font-semibold" style={{ color: isBest ? "#E8A33D" : "#8A9690", fontFamily: "Manrope" }}>{d.m}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function ShpDashboard({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length; // TODO: replace with a real notifications table + query

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoadError("Not signed in.");
        setLoading(false);
        return;
      }

      const [{ data: profileData, error: profileError }, { data: txnData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
      ]);

      if (profileError) {
        setLoadError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setTransactions(txnData || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#EDE8DB" }}>
        <p style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 600, fontSize: 13 }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#EDE8DB" }}>
        <p style={{ color: "#E8604C", fontFamily: "Manrope", fontWeight: 600, fontSize: 13 }}>
          Couldn't load your dashboard{loadError ? `: ${loadError}` : "."}
        </p>
      </div>
    );
  }

  const balance = profile.balance;
  const ceiling = profile.ceiling;
  const pct = ceiling > 0 ? Math.round((balance / ceiling) * 100) : 0;
  const inRecovery = Number(profile.debt_balance) > 0;

  const now = new Date();
  const thisMonthTxns = transactions.filter((t) => isSameMonth(new Date(t.created_at), now));
  const monthSaved = thisMonthTxns.reduce((s, t) => s + t.saved, 0);
  const monthTxnCount = thisMonthTxns.length;

  const monthly = buildMonthlyTrend(transactions);
  const maxMonthly = Math.max(...monthly.map((d) => d.v), 0);
  const bestMonth = monthly.reduce((best, d) => (d.v > best.v ? d : best), monthly[0]);
  const avgPerTxn = monthTxnCount > 0 ? Math.round(monthSaved / monthTxnCount) : 0;

  const recentTxns = transactions.slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "#EDE8DB" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">

        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                   style={{ background: "linear-gradient(135deg, #0E4B43, #1A5C53)", boxShadow: "0 8px 24px rgba(14, 75, 67, 0.25)" }}>
                <User size={20} color="#FFFFFF" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#F5B942] rounded-full border-2 border-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#14231F", fontFamily: "Fraunces", letterSpacing: "-0.3px" }}>{profile.name}</h2>
              <div className="flex items-center gap-2">
                <p className="text-[11px]" style={{ color: "#8A9690", fontFamily: "Manrope", fontWeight: 500 }}>Welcome back! 👋</p>
                <div className="w-1 h-1 rounded-full" style={{ background: "#3F8F7F" }} />
                <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#3F8F7F", fontFamily: "Manrope" }}>
                  <Activity size={11} /> {monthTxnCount} txns
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              className="relative p-2 rounded-xl transition-all hover:shadow-md"
              style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}
              onClick={() => onNavigate && onNavigate("notifications")}
            >
              <Bell size={17} style={{ color: "#14231F" }} />
              <NotificationBadge count={unread} />
            </button>
            <button
              className="px-4 py-2 rounded-xl text-[11px] font-bold transition-all hover:shadow-lg flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #0E4B43, #1A5C53)", color: "#FFFFFF", fontFamily: "Manrope", boxShadow: "0 4px 12px rgba(14, 75, 67, 0.2)" }}
              onClick={() => onNavigate && onNavigate("profile")}
            >
              <Heart size={13} /> Profile
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="space-y-6">
            <div className="rounded-3xl p-6 flex flex-col items-center shadow-xl relative overflow-hidden"
                 style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8F6F0 100%)", border: "1px solid rgba(229, 223, 208, 0.3)", boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #0E4B43, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}><PiggyBank size={15} style={{ color: "#0E4B43" }} /></div>
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Health Savings Balance</span>
              </div>

              <ProgressRing percentage={pct} balance={balance} ceiling={ceiling} />

              <div className="w-full mt-5 grid grid-cols-2 gap-2.5 relative z-10">
                <StatCard label="Goal" value={fmt(ceiling)} subtext={`${pct}% achieved`} color="#3F8F7F" icon={Target} trend={1} variant="compact" />
                <StatCard
                  label="Auto-Save" value="UGX 200–1,000"
                  subtext={inRecovery ? `recovery · ${profile.multiplier}x boost · owes ${fmt(profile.debt_balance)}` : "tiered per transaction"}
                  color={inRecovery ? "#E8A33D" : undefined}
                  icon={Zap} variant="compact"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Month Saved" value={fmt(monthSaved)} subtext="this month" icon={Calendar} trend={1} variant="compact" />
              <StatCard label="Transactions" value={monthTxnCount.toLocaleString()} subtext="this month" icon={Activity} variant="compact" />
            </div>

            <div className="rounded-2xl px-4 py-3 flex items-start gap-2.5 shadow-lg"
                 style={{ background: "linear-gradient(135deg, #0E4B43, #1A5C53)", boxShadow: "0 8px 24px rgba(14, 75, 67, 0.2)" }}>
              <div className="p-1.5 rounded-xl animate-pulse-slow" style={{ background: "rgba(245, 185, 66, 0.15)" }}><Shield size={18} style={{ color: "#F5B942" }} /></div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: "#FFFFFF", fontFamily: "Manrope" }}>Emergency Fund Active</p>
                <p className="text-[10.5px] mt-0.5" style={{ color: "rgba(255, 255, 255, 0.8)", fontFamily: "Manrope" }}>Protected & available for emergencies</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl p-5 shadow-xl" style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}><BarChart3 size={15} style={{ color: "#0E4B43" }} /></div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#14231F", fontFamily: "Manrope" }}>Monthly Trend</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold" style={{ color: "#3F8F7F", fontFamily: "Manrope" }}>{fmt(monthSaved)}</span>
                  <span className="text-[10px] font-medium" style={{ color: "#8A9690", fontFamily: "Manrope" }}>· {monthTxnCount} txns</span>
                </div>
              </div>

              <BarChart data={monthly} maxValue={maxMonthly} />

              <div className="mt-3 pt-3 flex justify-between text-[10px]" style={{ borderTop: "1px solid rgba(229, 223, 208, 0.3)" }}>
                <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>Avg: <strong style={{ color: "#14231F" }}>{fmt(avgPerTxn)}</strong></span>
                <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>Best: <strong style={{ color: "#E8A33D" }}>{fmt(bestMonth?.v || 0)}</strong></span>
              </div>
            </div>

            <div className="rounded-3xl p-5 shadow-xl" style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}><Clock size={15} style={{ color: "#0E4B43" }} /></div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#14231F", fontFamily: "Manrope" }}>Recent Activity</span>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate("transactions")}
                  className="text-[10px] flex items-center gap-0.5 font-bold transition-all hover:gap-1 group"
                  style={{ color: "#0E4B43", fontFamily: "Manrope" }}
                >
                  See all <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {recentTxns.length === 0 ? (
                <p className="text-center py-8 text-[12px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                  No transactions yet — they'll show up here automatically.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentTxns.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/40">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E6F4F0, #DCEDE7)" }}>
                          <ArrowDownRight size={15} style={{ color: "#3F8F7F" }} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold" style={{ color: "#14231F", fontFamily: "Manrope" }}>{txnLabel(t)}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>{txnDate(t)}</span>
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(63, 143, 127, 0.1)" }}>
                              <CheckCircle size={8} style={{ color: "#3F8F7F" }} />
                              <span className="text-[8px] font-bold" style={{ color: "#3F8F7F", fontFamily: "Manrope" }}>Done</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] font-bold" style={{ color: "#3F8F7F", fontFamily: "Space Grotesk" }}>+{fmt(t.saved)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Total Savings</p>
            <p className="text-[15px] font-bold mt-0.5" style={{ color: "#14231F", fontFamily: "Space Grotesk" }}>{fmt(balance)}</p>
          </div>
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Monthly</p>
            <p className="text-[15px] font-bold mt-0.5" style={{ color: "#14231F", fontFamily: "Space Grotesk" }}>{fmt(monthSaved)}</p>
          </div>
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#8A9690", fontFamily: "Manrope" }}>Transactions</p>
            <p className="text-[15px] font-bold mt-0.5" style={{ color: "#14231F", fontFamily: "Space Grotesk" }}>{monthTxnCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}