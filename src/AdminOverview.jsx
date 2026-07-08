import React from "react";
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Smartphone,
  Shield
} from "lucide-react";
import { SYSTEM_STATS, MONTHLY_POOLED, fmt } from "./lib/adminData";

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

// Enhanced Bar Chart Component
const BarChart = ({ data, maxValue }) => {
  return (
    <div className="flex items-end gap-3 h-48">
      {data.map((d, i) => {
        const h = (d.v / maxValue) * 100;
        const isMax = d.v === maxValue;
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
                  background: isMax 
                    ? "linear-gradient(180deg, #3B6FE0, #2952B3)" 
                    : "linear-gradient(180deg, #7B9FE8, #5B7FD5)",
                  boxShadow: isMax ? "0 4px 16px rgba(59, 111, 224, 0.3)" : "none",
                  minHeight: '4px'
                }}
              />
              {isMax && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Zap size={12} style={{ color: "#3B6FE0" }} />
                </div>
              )}
            </div>
            <span className="text-[11px] font-bold" style={{ 
              color: isMax ? "#3B6FE0" : "#101828", 
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
export default function AdminOverview() {
  const maxV = Math.max(...MONTHLY_POOLED.map((d) => d.v));
  const mtnPct = Math.round((SYSTEM_STATS.activeNetworks.mtn / SYSTEM_STATS.totalUsers) * 100);
  const totalUsers = SYSTEM_STATS.totalUsers;
  const growthRate = Math.round((SYSTEM_STATS.totalUsers / (SYSTEM_STATS.totalUsers - 312)) * 100 - 100);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFB" }}>
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg" style={{ background: "rgba(59, 111, 224, 0.1)" }}>
                <Shield size={16} style={{ color: "#3B6FE0" }} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ 
                color: "#3B6FE0", 
                fontFamily: "Manrope" 
              }}>
                Admin Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold" style={{ 
              color: "#101828", 
              fontFamily: "Space Grotesk" 
            }}>
              System Overview
            </h1>
            <p className="text-sm mt-1" style={{ 
              color: "#5B6472", 
              fontFamily: "Manrope" 
            }}>
              Real-time snapshot across all users and networks
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
                System Active
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
                <span>Refresh Data</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Users" 
          value={totalUsers.toLocaleString()} 
          subtext={`${growthRate}% growth this month`}
          icon={Users}
          trend={1}
          color="#1F9D63"
        />
        <StatCard 
          label="Total Pooled" 
          value={fmt(SYSTEM_STATS.totalPooled)} 
          subtext="across all users"
          icon={Wallet}
        />
        <StatCard 
          label="Transactions" 
          value={SYSTEM_STATS.totalTxnsThisMonth.toLocaleString()} 
          subtext="MTN + Airtel combined"
          icon={Activity}
        />
        <StatCard 
          label="Fees Collected" 
          value={fmt(SYSTEM_STATS.feesCollectedThisMonth)} 
          subtext="this month"
          icon={DollarSign}
          trend={1}
          color="#1F9D63"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-6">
        {/* Pooled Savings Chart */}
        <div 
          className="rounded-3xl p-6 transition-all hover:shadow-xl"
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
                Pooled Savings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold" style={{ 
                color: "#1F9D63", 
                fontFamily: "Manrope" 
              }}>
                +52% since Jan
              </span>
              <div className="px-2 py-1 rounded-lg text-[10px] font-bold" style={{
                background: "rgba(31, 157, 99, 0.1)",
                color: "#1F9D63",
                fontFamily: "Manrope"
              }}>
                System-wide
              </div>
            </div>
          </div>
          
          <BarChart data={MONTHLY_POOLED} maxValue={maxV} />
          
          <div className="mt-4 pt-4 flex justify-between text-xs" style={{ borderTop: "1px solid #E4E7EC" }}>
            <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
              Total pooled: <strong style={{ color: "#101828" }}>{fmt(SYSTEM_STATS.totalPooled)}</strong>
            </span>
            <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
              Average: <strong style={{ color: "#101828" }}>{(SYSTEM_STATS.totalPooled / SYSTEM_STATS.totalUsers).toLocaleString()} UGX</strong>
            </span>
          </div>
        </div>

        {/* Network Split */}
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
              Network Distribution
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-4 rounded-full overflow-hidden mb-5" style={{ 
            background: "#F0F1F3",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)"
          }}>
            <div 
              className="h-full transition-all duration-1000 relative"
              style={{ 
                width: `${mtnPct}%`, 
                background: "linear-gradient(90deg, #FFCC08, #F5B800)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
            </div>
            <div 
              className="h-full transition-all duration-1000"
              style={{ 
                width: `${100 - mtnPct}%`, 
                background: "linear-gradient(90deg, #E8604C, #D94A3D)"
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50/50"
                 style={{ background: "rgba(255, 204, 8, 0.05)" }}>
              <span className="flex items-center gap-3 text-[13px] font-bold" style={{ 
                color: "#101828", 
                fontFamily: "Manrope" 
              }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#FFCC08" }} />
                MTN
                <span className="text-[11px] font-medium" style={{ color: "#5B6472" }}>
                  (Market leader)
                </span>
              </span>
              <span className="text-[13px] font-bold" style={{ 
                color: "#101828", 
                fontFamily: "IBM Plex Mono" 
              }}>
                {SYSTEM_STATS.activeNetworks.mtn.toLocaleString()} ({mtnPct}%)
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50/50"
                 style={{ background: "rgba(232, 96, 76, 0.05)" }}>
              <span className="flex items-center gap-3 text-[13px] font-bold" style={{ 
                color: "#101828", 
                fontFamily: "Manrope" 
              }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#E8604C" }} />
                Airtel
                <span className="text-[11px] font-medium" style={{ color: "#5B6472" }}>
                  (Growing)
                </span>
              </span>
              <span className="text-[13px] font-bold" style={{ 
                color: "#101828", 
                fontFamily: "IBM Plex Mono" 
              }}>
                {SYSTEM_STATS.activeNetworks.airtel.toLocaleString()} ({100 - mtnPct}%)
              </span>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid #E4E7EC" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: "#5B6472" }} />
                  <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ 
                    color: "#5B6472", 
                    fontFamily: "Manrope" 
                  }}>
                    Pending Payouts
                  </p>
                </div>
                <p className="text-2xl font-bold mt-1" style={{ 
                  color: "#B07C0E", 
                  fontFamily: "Space Grotesk" 
                }}>
                  {SYSTEM_STATS.pendingPayouts}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
                background: "rgba(176, 124, 14, 0.08)"
              }}>
                <AlertCircle size={16} style={{ color: "#B07C0E" }} />
                <span className="text-[11px] font-medium" style={{ 
                  color: "#B07C0E", 
                  fontFamily: "Manrope" 
                }}>
                  {Math.round(SYSTEM_STATS.pendingPayouts / SYSTEM_STATS.totalUsers * 100)}% of users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(31, 157, 99, 0.06)",
          border: "1px solid rgba(31, 157, 99, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(31, 157, 99, 0.1)" }}>
            <CheckCircle size={16} style={{ color: "#1F9D63" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#1F9D63", fontFamily: "Manrope" }}>
              Active Users
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {Math.round(SYSTEM_STATS.totalUsers * 0.85).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(59, 111, 224, 0.06)",
          border: "1px solid rgba(59, 111, 224, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(59, 111, 224, 0.1)" }}>
            <Smartphone size={16} style={{ color: "#3B6FE0" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#3B6FE0", fontFamily: "Manrope" }}>
              Avg. Transaction
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {fmt(SYSTEM_STATS.totalPooled / SYSTEM_STATS.totalTxnsThisMonth)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(184, 124, 14, 0.06)",
          border: "1px solid rgba(184, 124, 14, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(184, 124, 14, 0.1)" }}>
            <Award size={16} style={{ color: "#B07C0E" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#B07C0E", fontFamily: "Manrope" }}>
              Avg. Savings
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {fmt(SYSTEM_STATS.totalPooled / SYSTEM_STATS.totalUsers)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{
          background: "rgba(232, 96, 76, 0.06)",
          border: "1px solid rgba(232, 96, 76, 0.1)"
        }}>
          <div className="p-2 rounded-xl" style={{ background: "rgba(232, 96, 76, 0.1)" }}>
            <TrendingUp size={16} style={{ color: "#E8604C" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#E8604C", fontFamily: "Manrope" }}>
              Growth Rate
            </p>
            <p className="text-sm font-bold" style={{ color: "#101828", fontFamily: "Space Grotesk" }}>
              {growthRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}