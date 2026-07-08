import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  BadgeCheck, 
  Building2, 
  ArrowLeft,
  Heart,
  Shield,
  CheckCircle,
  CreditCard,
  Wallet,
  Clock,
  TrendingUp,
  ChevronRight,
  X,
  Plus,
  Minus,
  Sparkles,
  Activity
} from "lucide-react";
import { BALANCE, HOSPITALS, SERVICE_FEE_RATE, NOTIFICATIONS, fmt } from "./lib/data";

const CATEGORIES = ["All", "Public", "Private"];

// Quick amount presets
const PRESETS = [50000, 100000, 150000, 200000];

export default function PayHospitalPage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  const filtered = HOSPITALS.filter((h) => {
    const matchesQuery =
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.location.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" ? true : h.category === category;
    return matchesQuery && matchesCategory;
  });

  const numericAmount = Number(amount.replace(/[^0-9]/g, "")) || 0;
  const fee = Math.round(numericAmount * (SERVICE_FEE_RATE / 100));
  const total = numericAmount + fee;
  const overLimit = total > BALANCE;

  const handlePay = async (e) => {
    e.preventDefault();
    if (numericAmount > 0 && !overLimit) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelected(null);
    setAmount("");
    setSubmitted(false);
  };

  // Success State
  if (submitted && selected) {
    return (
      <div className="min-h-screen" style={{ background: "#EDE8DB" }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6">
            <button
              onClick={reset}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#8A9690", fontFamily: "Manrope" }}
            >
              <ArrowLeft size={16} />
              Pay another hospital
            </button>
          </div>

          <div 
            className="rounded-3xl p-8 text-center shadow-xl"
            style={{ 
              background: "linear-gradient(180deg, #FFFFFF 0%, #F8F6F0 100%)",
              border: "1px solid rgba(229, 223, 208, 0.5)"
            }}
          >
            {/* Success Animation */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full animate-ping" 
                     style={{ background: "rgba(63, 143, 127, 0.2)" }} />
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg, #DCEDE7, #3F8F7F)" }}>
                  <CheckCircle size={32} color="#FFFFFF" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold" style={{ 
              color: "#14231F", 
              fontFamily: "Fraunces" 
            }}>
              Payment Successful! 🎉
            </h2>
            <p className="text-sm mt-2" style={{ 
              color: "#5C6B64", 
              fontFamily: "Manrope" 
            }}>
              Your payment to <strong className="text-[#0E4B43]">{selected.name}</strong> has been processed
            </p>

            <div className="mt-6 p-4 rounded-2xl" style={{ background: "#F6F3EC" }}>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                  Hospital Fee
                </span>
                <span className="text-sm font-semibold" style={{ 
                  color: "#14231F", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {fmt(numericAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: "#E5DFD0" }}>
                <span className="text-sm" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                  Service Fee ({SERVICE_FEE_RATE}%)
                </span>
                <span className="text-sm font-semibold" style={{ 
                  color: "#E87A5A", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {fmt(fee)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-dashed" style={{ borderColor: "#E5DFD0" }}>
                <span className="text-sm font-bold" style={{ 
                  color: "#14231F", 
                  fontFamily: "Manrope" 
                }}>
                  Total Deducted
                </span>
                <span className="text-lg font-bold" style={{ 
                  color: "#0E4B43", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {fmt(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl" style={{ background: "rgba(63, 143, 127, 0.08)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#3F8F7F", fontFamily: "Manrope" }}>
                  New Balance
                </span>
                <span className="text-lg font-bold" style={{ 
                  color: "#0E4B43", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {fmt(BALANCE - total)}
                </span>
              </div>
            </div>

            <button
              onClick={reset}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
                color: "#FFFFFF",
                fontFamily: "Manrope",
                boxShadow: "0 4px 12px rgba(14, 75, 67, 0.2)"
              }}
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form
  if (selected) {
    return (
      <div className="min-h-screen" style={{ background: "#EDE8DB" }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelected(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md"
              style={{ background: "#FFFFFF", border: "1px solid #E5DFD0" }}
            >
              <ArrowLeft size={16} color="#14231F" />
            </button>
            <h1 className="text-xl font-bold" style={{ 
              color: "#14231F", 
              fontFamily: "Fraunces" 
            }}>
              Make Payment
            </h1>
          </div>

          {/* Hospital Card */}
          <div 
            className="rounded-2xl p-5 mb-6 flex items-center gap-4 shadow-md"
            style={{ 
              background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: "rgba(255,255,255,0.1)" }}>
              <Building2 size={22} color="#F5B942" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-white" style={{ fontFamily: "Manrope" }}>
                  {selected.name}
                </p>
                {selected.verified && <BadgeCheck size={16} color="#F5B942" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin size={12} color="rgba(255,255,255,0.6)" />
                <p className="text-xs text-white/60" style={{ fontFamily: "Manrope" }}>
                  {selected.location} · {selected.category}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg text-xs font-bold" style={{
              background: "rgba(245, 185, 66, 0.2)",
              color: "#F5B942",
              fontFamily: "Manrope"
            }}>
              Active
            </div>
          </div>

          {/* Balance Card */}
          <div 
            className="rounded-2xl p-4 mb-6 flex items-center justify-between"
            style={{ background: "#FFFFFF", border: "1px solid #E5DFD0" }}
          >
            <div className="flex items-center gap-2">
              <Wallet size={16} style={{ color: "#0E4B43" }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ 
                color: "#8A9690", 
                fontFamily: "Manrope" 
              }}>
                Available Balance
              </span>
            </div>
            <span className="text-lg font-bold" style={{ 
              color: "#0E4B43", 
              fontFamily: "IBM Plex Mono" 
            }}>
              {fmt(BALANCE)}
            </span>
          </div>

          {/* Payment Form */}
          <div 
            className="rounded-2xl p-6 shadow-md"
            style={{ 
              background: "#FFFFFF", 
              border: "1px solid rgba(229, 223, 208, 0.5)"
            }}
          >
            <form onSubmit={handlePay} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                       style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                  <CreditCard size={14} />
                  Amount (UGX)
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                        style={{ color: "#8A9690", fontFamily: "IBM Plex Mono" }}>
                    UGX
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    autoFocus
                    className="w-full pl-14 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: "#FAFAF8",
                      border: overLimit ? "2px solid #E8604C" : "1px solid #E5DFD0",
                      fontFamily: "IBM Plex Mono",
                      fontSize: 16,
                      color: "#14231F",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#0E4B43"}
                    onBlur={(e) => {
                      if (!overLimit) e.target.style.borderColor = "#E5DFD0";
                    }}
                  />
                </div>
                {overLimit && (
                  <p className="mt-2 text-xs font-semibold flex items-center gap-1.5"
                     style={{ color: "#E8604C", fontFamily: "Manrope" }}>
                    <X size={14} />
                    Amount plus {SERVICE_FEE_RATE}% fee exceeds your balance
                  </p>
                )}
              </div>

              {/* Quick Amounts */}
              {!amount && (
                <div>
                  <p className="text-xs font-medium" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                    Quick select:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset.toString())}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
                        style={{
                          background: "#F6F3EC",
                          color: "#0E4B43",
                          fontFamily: "Manrope",
                          border: "1px solid transparent"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0E4B43"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                      >
                        {fmt(preset)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Breakdown */}
              {numericAmount > 0 && (
                <div 
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: "#F6F3EC" }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                      Hospital Fee
                    </span>
                    <span className="font-semibold" style={{ 
                      color: "#14231F", 
                      fontFamily: "IBM Plex Mono" 
                    }}>
                      {fmt(numericAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                      Service Fee ({SERVICE_FEE_RATE}%)
                    </span>
                    <span className="font-semibold" style={{ 
                      color: "#E87A5A", 
                      fontFamily: "IBM Plex Mono" 
                    }}>
                      {fmt(fee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm border-t" 
                       style={{ borderColor: "#E5DFD0" }}>
                    <span className="font-bold" style={{ 
                      color: "#14231F", 
                      fontFamily: "Manrope" 
                    }}>
                      Total
                    </span>
                    <span className="text-base font-bold" style={{ 
                      color: "#0E4B43", 
                      fontFamily: "IBM Plex Mono" 
                    }}>
                      {fmt(total)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={numericAmount <= 0 || overLimit || isLoading}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden"
                style={{
                  background: numericAmount > 0 && !overLimit 
                    ? "linear-gradient(135deg, #0E4B43, #1A5C53)" 
                    : "#E5DFD0",
                  color: numericAmount > 0 && !overLimit ? "#FFFFFF" : "#8A9690",
                  fontFamily: "Manrope",
                  cursor: numericAmount > 0 && !overLimit ? "pointer" : "not-allowed",
                  boxShadow: numericAmount > 0 && !overLimit 
                    ? "0 4px 12px rgba(14, 75, 67, 0.2)" 
                    : "none"
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Pay {selected.name.split(" ")[0]}</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Search & List View
  return (
    <div className="min-h-screen" style={{ background: "#EDE8DB" }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ 
              color: "#14231F", 
              fontFamily: "Fraunces" 
            }}>
              Pay Hospital
            </h1>
            <p className="text-sm" style={{ 
              color: "#8A9690", 
              fontFamily: "Manrope" 
            }}>
              Find and pay hospitals directly
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("notifications")}
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ background: "#FFFFFF", border: "1px solid #E5DFD0" }}
          >
            <Activity size={17} color="#14231F" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: "#E8604C", color: "#FFFFFF", fontFamily: "Manrope" }}>
                {unread}
              </span>
            )}
          </button>
        </div>

        {/* Balance Card */}
        <div 
          className="rounded-2xl p-5 mb-6 shadow-md"
          style={{ 
            background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60" 
                 style={{ fontFamily: "Manrope" }}>
                Available Balance
              </p>
              <p className="text-2xl font-bold mt-1" style={{ 
                color: "#FFFFFF", 
                fontFamily: "Fraunces" 
              }}>
                {fmt(BALANCE)}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(245, 185, 66, 0.15)" }}>
              <div className="flex items-center gap-1.5">
                <Heart size={14} color="#F5B942" />
                <span className="text-xs font-bold" style={{ color: "#F5B942", fontFamily: "Manrope" }}>
                  Health Fund
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} color="#8A9690" className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospital or town..."
            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: query ? "2px solid #0E4B43" : "1px solid #E5DFD0",
              fontFamily: "Manrope",
              fontSize: 14,
              color: "#14231F",
            }}
            onFocus={(e) => e.target.style.borderColor = "#0E4B43"}
            onBlur={(e) => {
              if (!query) e.target.style.borderColor = "#E5DFD0";
            }}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                style={{
                  background: active ? "#0E4B43" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#5C6B64",
                  border: active ? "none" : "1px solid #E5DFD0",
                  boxShadow: active ? "0 4px 12px rgba(14, 75, 67, 0.2)" : "none",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            Registered Facilities
          </p>
          <span className="text-xs font-medium" style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            {filtered.length} found
          </span>
        </div>

        {/* Hospital List */}
        <div 
          className="rounded-2xl overflow-hidden shadow-md"
          style={{ 
            background: "#FFFFFF", 
            border: "1px solid rgba(229, 223, 208, 0.5)"
          }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Building2 size={32} className="mx-auto mb-3" style={{ color: "#E5DFD0" }} />
              <p className="text-sm font-medium" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
                No facilities found
              </p>
              <p className="text-xs mt-1" style={{ color: "#C5CDC8", fontFamily: "Manrope" }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filtered.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelected(h)}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-gray-50/50"
                style={{ borderTop: "1px solid #EFEBE0" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: "rgba(14, 75, 67, 0.08)" }}>
                  <Building2 size={18} style={{ color: "#0E4B43" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold truncate" style={{ 
                      color: "#14231F", 
                      fontFamily: "Manrope" 
                    }}>
                      {h.name}
                    </p>
                    {h.verified && <BadgeCheck size={14} style={{ color: "#3F8F7F" }} />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin size={11} style={{ color: "#8A9690" }} />
                    <p className="text-[11px]" style={{ 
                      color: "#8A9690", 
                      fontFamily: "Manrope" 
                    }}>
                      {h.location}
                    </p>
                    <span className="w-1 h-1 rounded-full" style={{ background: "#E5DFD0" }} />
                    <span className="text-[11px] font-medium" style={{ 
                      color: h.category === "Public" ? "#3F8F7F" : "#8A9690",
                      fontFamily: "Manrope" 
                    }}>
                      {h.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold" style={{ 
                  color: "#0E4B43", 
                  fontFamily: "Manrope" 
                }}>
                  Pay
                  <ChevronRight size={14} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Shield size={12} style={{ color: "#8A9690" }} />
            <p className="text-[10px]" style={{ color: "#8A9690", fontFamily: "Manrope" }}>
              All payments are secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}