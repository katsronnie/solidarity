import React from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  CreditCard,
  Smartphone,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Percent,
  Calendar,
  Building,
  Users
} from "lucide-react";
import {
  SERVICE_FEE_RATE, TOTAL_REVENUE_BALANCE, REVENUE_THIS_MONTH, REVENUE_LAST_MONTH,
  REVENUE_TXNS_THIS_MONTH, MONTHLY_REVENUE, REVENUE_BY_TYPE, REVENUE_BY_NETWORK, fmt,
} from "./lib/adminData";

// Enhanced Stat Card Component
const StatCard = ({ label, value, subtext, icon: Icon, trend, trendValue, color }) => (
  <div 
    className="rounded-2xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    style={{ 
      background: "linear-gradient(135deg, #FFFFFF, #F8FAFB)",
      border: "1px solid rgba(228, 231, 236, 0.5)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider font-bold" style={{ 
          color: "#5B6472", 
          fontFamily: "Manrope" 
        }}>
          {label}
        </p>
        <p className="text-[22px] font-bold mt-1.5" style={{ 
          color: "#101828", 
          fontFamily: "Space Grotesk" 
        }}>
          {value}
        </p>
        {subtext && (
          <div className="flex items-center gap-1.5 mt-1">
            {trend !== undefined && (
              trend > 0 ? 
                <TrendingUp size={14} style={{ color: "#1F9D63" }} /> :
                <TrendingDown size={14} style={{ color: "#E8604C" }} />
            )}
            <p className="text-[11px] font-medium" style={{ 
              color: color || "#5B6472", 
              fontFamily: "Manrope" 
            }}>
              {subtext}
            </p>
          </div>
        )}
      </div>
      {Icon && (
        <div className="p-2.5 rounded-xl" style={{ 
          background: "rgba(59, 111, 224, 0.08)" 
        }}>
          <Icon size={20} style={{ color: "#3B6FE0" }} />
        </div>
      )}
    </div>
  </div>
);

// Enhanced Donut Chart Component
const Donut = ({ segments, centerLabel, centerValue }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = 0;
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100;
          const dashLength = (percentage / 100) * circumference;
          const offset = circumference - dashLength;
          const rotation = currentAngle;
          currentAngle += (percentage / 100) * 360;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2}) rotate(${rotation} ${size / 2} ${size / 2})`}
              className="transition-all duration-1000 hover:opacity-80"
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ 
          color: "#5B6472", 
          fontFamily: "Manrope" 
        }}>
          {centerLabel}
        </p>
        <p className="text-xl font-bold" style={{ 
          color: "#101828", 
          fontFamily: "Space Grotesk" 
        }}>
          {centerValue}
        </p>
      </div>
    </div>
  );
};

// Enhanced Bar Chart
const BarChart = ({ data, maxValue }) => {
  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d, i) => {
        const h = (d.v / maxValue) * 100;
        const isLatest = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
            <span className="text-[10px] font-medium" style={{ 
              color: "#5B6472", 
              fontFamily: "IBM Plex Mono" 
            }}>
              {(d.v / 1_000_000).toFixed(1)}M
            </span>
            <div className="relative w-full">
              <div 
                className="w-full rounded-lg transition-all duration-500 hover:opacity-80 group-hover:scale-105"
                style={{ 
                  height: `${h}%`, 
                  background: isLatest 
                    ? "linear-gradient(180deg, #3B6FE0, #2952B3)" 
                    : "linear-gradient(180deg, #C7D6F5, #A8BDE8)",
                  boxShadow: isLatest ? "0 4px 16px rgba(59, 111, 224, 0.3)" : "none",
                  minHeight: '4px'
                }}
              />
              {isLatest && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Zap size={12} style={{ color: "#3B6FE0" }} />
                </div>
              )}
            </div>
            <span className="text-[11px] font-bold" style={{ 
              color: isLatest ? "#3B6FE0" : "#101828", 
              fontFamily: "Manrope" 
            }}>
              {d.m}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Main Component
export default function AdminRevenue() {
  const maxV = Math.max(...MONTHLY_REVENUE.map((d) => d.v));
  const growth = Math.round(((REVENUE_THIS_MONTH - REVENUE_LAST_MONTH) / REVENUE_LAST_MONTH) * 100);
  const typeTotal = REVENUE_BY_TYPE.reduce((s, t) => s + t.value, 0);
  const netTotal = REVENUE_BY_NETWORK.reduce((s, t) => s + t.value, 0);
  const avgFee = Math.round(REVENUE_THIS_MONTH / REVENUE_TXNS_THIS_MONTH);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      {/* Revenue Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg" style={{ background: "rgba(59, 111, 224, 0.1)" }}>
                <DollarSign size={16} style={{ color: "#3B6FE0" }} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ 
                color: "#3B6FE0", 
                fontFamily: "Manrope" 
              }}>
                Revenue Management
              </span>
            </div>
            <h1 className="text-3xl font-bold" style={{ 
              color: "#101828", 
              fontFamily: "Space Grotesk" 
            }}>
              Revenue Overview
            </h1>
            <p className="text-sm mt-1" style={{ 
              color: "#5B6472", 
              fontFamily: "Manrope" 
            }}>
              {SERVICE_FEE_RATE}% platform fee collected on every withdrawal and hospital bill payment
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ 
              background: "#FFFFFF",
              border: "1px solid #E4E7EC"
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#1F9D63" }} />
              <span className="text-[11px] font-semibold" style={{ 
                color: "#1F9D63", 
                fontFamily: "Manrope" 
              }}>
                Active
              </span>
            </div>
            <button className="px-4 py-2 rounded-2xl text-xs font-bold transition-all hover:shadow-lg"
                    style={{ 
                      background: "linear-gradient(135deg, #3B6FE0, #2952B3)",
                      color: "#FFFFFF",
                      fontFamily: "Manrope"
                    }}>
              <div className="flex items-center gap-2">
                <Activity size={14} />
                <span>Export Data</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card - Premium */}
      <div 
        className="rounded-3xl p-8 mb-6 relative overflow-hidden shadow-xl"
        style={{ 
          background: "linear-gradient(135deg, #16294D 0%, #0D1526 100%)",
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #3B6FE0, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
             style={{ background: "radial-gradient(circle, #4ADE93, transparent 70%)" }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Wallet size={18} style={{ color: "#7C8CA8" }} />
            </div>
            <p className="text-[11px] uppercase tracking-wider font-bold" style={{ 
              color: "#7C8CA8", 
              fontFamily: "Manrope" 
            }}>
              Total Revenue Balance
            </p>
          </div>
          
          <p className="text-4xl font-bold" style={{ 
            color: "#FFFFFF", 
            fontFamily: "Space Grotesk" 
          }}>
            {fmt(TOTAL_REVENUE_BALANCE)}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ 
              background: "rgba(31, 157, 99, 0.15)"
            }}>
              <ArrowUpRight size={14} style={{ color: "#4ADE93" }} />
              <span className="text-[12px] font-bold" style={{ 
                color: "#4ADE93", 
                fontFamily: "Manrope" 
              }}>
                {fmt(REVENUE_THIS_MONTH)} this month
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[12px] font-bold ${growth >= 0 ? 'text-[#4ADE93]' : 'text-[#E8604C]'}`}>
                {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% vs last month
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{
              background: "rgba(255,255,255,0.06)"
            }}>
              <Calendar size={12} style={{ color: "#7C8CA8" }} />
              <span className="text-[11px]" style={{ color: "#7C8CA8", fontFamily: "Manrope" }}>
                {REVENUE_TXNS_THIS_MONTH.toLocaleString()} transactions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="This Month" 
          value={fmt(REVENUE_THIS_MONTH)} 
          subtext={`from ${REVENUE_TXNS_THIS_MONTH.toLocaleString()} txns`}
          icon={Activity}
          trend={1}
          color="#1F9D63"
        />
        <StatCard 
          label="Last Month" 
          value={fmt(REVENUE_LAST_MONTH)} 
          subtext={`${growth >= 0 ? '+' : ''}${growth}% change`}
          icon={Calendar}
          trend={growth >= 0 ? 1 : -1}
          color={growth >= 0 ? "#1F9D63" : "#E8604C"}
        />
        <StatCard 
          label="Fee Rate" 
          value={`${SERVICE_FEE_RATE}%`} 
          subtext="withdraw & hospital pay"
          icon={Percent}
        />
        <StatCard 
          label="Avg. Fee / Txn" 
          value={fmt(avgFee)} 
          subtext="per transaction"
          icon={DollarSign}
        />
      </div>

      {/* Monthly Revenue Chart */}
      <div 
        className="rounded-3xl p-6 mb-6 transition-all hover:shadow-xl"
        style={{ 
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)",
          border: "1px solid rgba(228, 231, 236, 0.5)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(59, 111, 224, 0.08)" }}>
              <BarChart3 size={16} style={{ color: "#3B6FE0" }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ 
              color: "#101828", 
              fontFamily: "Manrope" 
            }}>
              Monthly Revenue Trend
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold" style={{ 
              color: "#1F9D63", 
              fontFamily: "Manrope" 
            }}>
              +{growth}% this month
            </span>
            <div className="px-2 py-1 rounded-lg text-[10px] font-bold" style={{
              background: "rgba(59, 111, 224, 0.08)",
              color: "#3B6FE0",
              fontFamily: "Manrope"
            }}>
              Revenue Growth
            </div>
          </div>
        </div>
        
        <BarChart data={MONTHLY_REVENUE} maxValue={maxV} />
        
        <div className="mt-4 pt-4 flex justify-between text-xs" style={{ borderTop: "1px solid #E4E7EC" }}>
          <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
            Total: <strong style={{ color: "#101828" }}>{fmt(TOTAL_REVENUE_BALANCE)}</strong>
          </span>
          <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
            Average: <strong style={{ color: "#101828" }}>{fmt(Math.round(TOTAL_REVENUE_BALANCE / MONTHLY_REVENUE.length))}</strong>
          </span>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Type */}
        <div 
          className="rounded-3xl p-6 transition-all hover:shadow-xl"
          style={{ 
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)",
            border: "1px solid rgba(228, 231, 236, 0.5)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(59, 111, 224, 0.08)" }}>
              <PieChart size={16} style={{ color: "#3B6FE0" }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ 
              color: "#101828", 
              fontFamily: "Manrope" 
            }}>
              Revenue by Transaction Type
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <Donut 
              segments={REVENUE_BY_TYPE} 
              centerLabel="Total" 
              centerValue={fmt(typeTotal).replace("UGX ", "")} 
            />
            
            <div className="w-full mt-6 space-y-2.5">
              {REVENUE_BY_TYPE.map((t) => {
                const pct = Math.round((t.value / typeTotal) * 100);
                return (
                  <div key={t.label} className="flex items-center justify-between p-2.5 rounded-xl transition-all hover:bg-gray-50/50">
                    <span className="flex items-center gap-2.5 text-[12.5px] font-bold" style={{ 
                      color: "#101828", 
                      fontFamily: "Manrope" 
                    }}>
                      <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                      {t.label}
                    </span>
                    <span className="text-[12px] font-medium" style={{ 
                      color: "#5B6472", 
                      fontFamily: "IBM Plex Mono" 
                    }}>
                      {fmt(t.value)} <span className="text-[10px]" style={{ color: "#8A96A8" }}>({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue by Network */}
        <div 
          className="rounded-3xl p-6 transition-all hover:shadow-xl"
          style={{ 
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)",
            border: "1px solid rgba(228, 231, 236, 0.5)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(59, 111, 224, 0.08)" }}>
              <Smartphone size={16} style={{ color: "#3B6FE0" }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ 
              color: "#101828", 
              fontFamily: "Manrope" 
            }}>
              Revenue by Network
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <Donut 
              segments={REVENUE_BY_NETWORK} 
              centerLabel="Total" 
              centerValue={fmt(netTotal).replace("UGX ", "")} 
            />
            
            <div className="w-full mt-6 space-y-2.5">
              {REVENUE_BY_NETWORK.map((t) => {
                const pct = Math.round((t.value / netTotal) * 100);
                return (
                  <div key={t.label} className="flex items-center justify-between p-2.5 rounded-xl transition-all hover:bg-gray-50/50">
                    <span className="flex items-center gap-2.5 text-[12.5px] font-bold" style={{ 
                      color: "#101828", 
                      fontFamily: "Manrope" 
                    }}>
                      <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                      {t.label}
                    </span>
                    <span className="text-[12px] font-medium" style={{ 
                      color: "#5B6472", 
                      fontFamily: "IBM Plex Mono" 
                    }}>
                      {fmt(t.value)} <span className="text-[10px]" style={{ color: "#8A96A8" }}>({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(59, 111, 224, 0.06)",
          border: "1px solid rgba(59, 111, 224, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(59, 111, 224, 0.1)" }}>
            <TrendingUp size={16} style={{ color: "#3B6FE0" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#3B6FE0", fontFamily: "Manrope" }}>
              Growth Rate
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {growth}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(31, 157, 99, 0.06)",
          border: "1px solid rgba(31, 157, 99, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(31, 157, 99, 0.1)" }}>
            <Award size={16} style={{ color: "#1F9D63" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#1F9D63", fontFamily: "Manrope" }}>
              Top Revenue
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {REVENUE_BY_TYPE.reduce((max, t) => t.value > max.value ? t : max).label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(184, 124, 14, 0.06)",
          border: "1px solid rgba(184, 124, 14, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(184, 124, 14, 0.1)" }}>
            <Users size={16} style={{ color: "#B07C0E" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B07C0E", fontFamily: "Manrope" }}>
              Active Users
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {REVENUE_TXNS_THIS_MONTH.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(232, 96, 76, 0.06)",
          border: "1px solid rgba(232, 96, 76, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(232, 96, 76, 0.1)" }}>
            <Clock size={16} style={{ color: "#E8604C" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#E8604C", fontFamily: "Manrope" }}>
              Avg. Transaction
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {fmt(avgFee)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}