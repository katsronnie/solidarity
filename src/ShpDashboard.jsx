import React from "react";
import { 
  Shield, 
  ChevronRight, 
  User, 
  Bell, 
  Wallet, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Award,
  Heart,
  Activity,
  BarChart3,
  Circle,
  Gift,
  PiggyBank,
  Calendar,
  Target
} from "lucide-react";
import { 
  USER, BALANCE, MONTH_SAVED, MONTH_TXNS, CEILING, RATE, PCT,
  MONTHLY, TRANSACTIONS, NOTIFICATIONS, fmt 
} from "./lib/data";

// Enhanced Stat Card
const StatCard = ({ label, value, subtext, icon: Icon, color, trend, variant = "default" }) => {
  const isCompact = variant === "compact";
  return (
    <div 
      className={`rounded-2xl transition-all duration-300 hover:shadow-xl group ${isCompact ? 'p-3.5' : 'p-4'}`}
      style={{ 
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${isCompact ? 'text-[9px]' : 'text-[10px]'} uppercase tracking-wider font-bold`} style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            {label}
          </p>
          <p className={`${isCompact ? 'text-[16px]' : 'text-[18px]'} mt-1 font-bold`} style={{ 
            color: "#14231F", 
            fontFamily: "Space Grotesk",
            fontWeight: 700 
          }}>
            {value}
          </p>
          {subtext && (
            <div className="flex items-center gap-1 mt-0.5">
              {trend && (
                <span className={`text-[10px] font-bold ${trend > 0 ? 'text-[#1F9D63]' : 'text-[#E8604C]'}`}>
                  {trend > 0 ? '↑' : '↓'}
                </span>
              )}
              <p className={`${isCompact ? 'text-[9px]' : 'text-[10.5px]'} font-medium`} style={{ 
                color: color || "#8A9690", 
                fontFamily: "Manrope" 
              }}>
                {subtext}
              </p>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${isCompact ? 'p-2' : 'p-2.5'} rounded-xl transition-all group-hover:scale-110`} style={{ 
            background: "rgba(14, 75, 67, 0.06)" 
          }}>
            <Icon size={isCompact ? 15 : 18} style={{ color: "#0E4B43" }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Notification Badge
const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse" 
         style={{ 
           background: "linear-gradient(135deg, #E83A3A, #C62828)",
           color: "#FFFFFF", 
           fontFamily: "Manrope",
           boxShadow: "0 2px 8px rgba(232, 58, 58, 0.4)"
         }}>
      {count > 9 ? '9+' : count}
    </div>
  );
};

// Enhanced Progress Ring with smaller font
const ProgressRing = ({ percentage, size = 150, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Animated glow */}
      <div className="absolute inset-0 rounded-full animate-pulse-slow opacity-20"
           style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />
      
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
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringBg)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ 
            filter: "drop-shadow(0 0 15px rgba(63, 143, 127, 0.2))",
            strokeDashoffset: offset
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Sparkles size={14} style={{ color: "#F5B942" }} />
        <p className="text-[22px] font-bold" style={{ 
          color: "#14231F", 
          fontFamily: "Space Grotesk",
          letterSpacing: "-0.5px"
        }}>
          {fmt(BALANCE)}
        </p>
        <p className="text-[10px] font-medium" style={{ 
          color: "#8A9690", 
          fontFamily: "Manrope" 
        }}>
          of {fmt(CEILING)}
        </p>
        <div className="mt-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
             style={{ 
               background: "linear-gradient(135deg, rgba(63, 143, 127, 0.12), rgba(14, 75, 67, 0.08))",
               color: "#0E4B43",
               fontFamily: "Manrope"
             }}>
          <Circle size={5} fill="#0E4B43" color="#0E4B43" />
          {PCT}% Complete
        </div>
      </div>
    </div>
  );
};

// Enhanced Bar Chart
const BarChart = ({ data, maxValue }) => {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => {
        const h = (d.v / maxValue) * 100;
        const isBest = d.v === maxValue;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 group">
            <div className="relative w-full">
              <div 
                className="w-full rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                style={{ 
                  height: `${h}%`, 
                  background: isBest 
                    ? "linear-gradient(180deg, #F5B942, #E8A33D)" 
                    : "linear-gradient(180deg, #DCEDE7, #B8D5CC)",
                  minHeight: '4px',
                  boxShadow: isBest ? "0 4px 16px rgba(245, 185, 66, 0.3)" : "none",
                }}
              >
                {isBest && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Zap size={10} style={{ color: "#E8A33D" }} />
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] font-semibold" style={{ 
              color: isBest ? "#E8A33D" : "#8A9690", 
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
export default function ShpDashboard({ onNavigate }) {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const maxMonthly = Math.max(...MONTHLY.map(d => d.v));
  const savingsGrowth = 12;

  return (
    <div className="min-h-screen" style={{ background: "#EDE8DB" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                   style={{ 
                     background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
                     boxShadow: "0 8px 24px rgba(14, 75, 67, 0.25)"
                   }}>
                <User size={20} color="#FFFFFF" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#F5B942] rounded-full border-2 border-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ 
                color: "#14231F", 
                fontFamily: "Fraunces",
                letterSpacing: "-0.3px"
              }}>
                {USER.name}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-[11px]" style={{ 
                  color: "#8A9690", 
                  fontFamily: "Manrope", 
                  fontWeight: 500 
                }}>
                  Welcome back! 👋
                </p>
                <div className="w-1 h-1 rounded-full" style={{ background: "#3F8F7F" }} />
                <p className="text-[10px] font-semibold flex items-center gap-1" style={{ 
                  color: "#3F8F7F", 
                  fontFamily: "Manrope" 
                }}>
                  <Activity size={11} />
                  {MONTH_TXNS} txns
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button 
              className="relative p-2 rounded-xl transition-all hover:shadow-md"
              style={{ 
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)"
              }}
              onClick={() => onNavigate && onNavigate("notifications")}
            >
              <Bell size={17} style={{ color: "#14231F" }} />
              <NotificationBadge count={unread} />
            </button>
            <button 
              className="px-4 py-2 rounded-xl text-[11px] font-bold transition-all hover:shadow-lg flex items-center gap-1.5"
              style={{ 
                background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
                color: "#FFFFFF", 
                fontFamily: "Manrope",
                boxShadow: "0 4px 12px rgba(14, 75, 67, 0.2)"
              }}
              onClick={() => onNavigate && onNavigate("profile")}
            >
              <Heart size={13} />
              Profile
            </button>
          </div>
        </header>

        {/* Two Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div 
              className="rounded-3xl p-6 flex flex-col items-center shadow-xl relative overflow-hidden"
              style={{ 
                background: "linear-gradient(180deg, #FFFFFF 0%, #F8F6F0 100%)", 
                border: "1px solid rgba(229, 223, 208, 0.3)",
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
                   style={{ background: "radial-gradient(circle, #0E4B43, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
                   style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
                  <PiggyBank size={15} style={{ color: "#0E4B43" }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ 
                  color: "#8A9690", 
                  fontFamily: "Manrope" 
                }}>
                  Health Savings Balance
                </span>
              </div>
              
              <ProgressRing percentage={PCT} />
              
              <div className="w-full mt-5 grid grid-cols-2 gap-2.5 relative z-10">
                <StatCard 
                  label="Goal" 
                  value={fmt(CEILING)} 
                  subtext={`${PCT}% achieved`}
                  color="#3F8F7F"
                  icon={Target}
                  trend={1}
                  variant="compact"
                />
                <StatCard 
                  label="Auto-Save" 
                  value={`${RATE}%`} 
                  subtext="per transaction"
                  icon={Zap}
                  variant="compact"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                label="Month Saved" 
                value={fmt(MONTH_SAVED)} 
                subtext="this month"
                icon={Calendar}
                trend={1}
                variant="compact"
              />
              <StatCard 
                label="Transactions" 
                value={MONTH_TXNS.toLocaleString()} 
                subtext="this month"
                icon={Activity}
                variant="compact"
              />
            </div>

            {/* Security Banner */}
            <div 
              className="rounded-2xl px-4 py-3 flex items-start gap-2.5 shadow-lg"
              style={{ 
                background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
                boxShadow: "0 8px 24px rgba(14, 75, 67, 0.2)"
              }}
            >
              <div className="p-1.5 rounded-xl animate-pulse-slow" style={{ background: "rgba(245, 185, 66, 0.15)" }}>
                <Shield size={18} style={{ color: "#F5B942" }} />
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ 
                  color: "#FFFFFF", 
                  fontFamily: "Manrope" 
                }}>
                  Emergency Fund Active
                </p>
                <p className="text-[10.5px] mt-0.5" style={{ 
                  color: "rgba(255, 255, 255, 0.8)", 
                  fontFamily: "Manrope" 
                }}>
                  Protected & available for emergencies
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Monthly Chart */}
            <div 
              className="rounded-3xl p-5 shadow-xl"
              style={{ 
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
                    <BarChart3 size={15} style={{ color: "#0E4B43" }} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ 
                    color: "#14231F", 
                    fontFamily: "Manrope" 
                  }}>
                    Monthly Trend
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold" style={{ 
                    color: "#3F8F7F", 
                    fontFamily: "Manrope" 
                  }}>
                    {fmt(MONTH_SAVED)}
                  </span>
                  <span className="text-[10px] font-medium" style={{ 
                    color: "#8A9690", 
                    fontFamily: "Manrope" 
                  }}>
                    · {MONTH_TXNS} txns
                  </span>
                </div>
              </div>
              
              <BarChart data={MONTHLY} maxValue={maxMonthly} />
              
              <div className="mt-3 pt-3 flex justify-between text-[10px]" style={{ borderTop: "1px solid rgba(229, 223, 208, 0.3)" }}>
                <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
                  Avg: <strong style={{ color: "#14231F" }}>{fmt(Math.round(MONTH_SAVED / MONTH_TXNS))}</strong>
                </span>
                <span style={{ color: "#5B6472", fontFamily: "Manrope" }}>
                  Best: <strong style={{ color: "#E8A33D" }}>{fmt(Math.max(...MONTHLY.map(d => d.v)))}</strong>
                </span>
              </div>
            </div>

            {/* Recent Transactions */}
            <div 
              className="rounded-3xl p-5 shadow-xl"
              style={{ 
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
                    <Clock size={15} style={{ color: "#0E4B43" }} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ 
                    color: "#14231F", 
                    fontFamily: "Manrope" 
                  }}>
                    Recent Activity
                  </span>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate("transactions")}
                  className="text-[10px] flex items-center gap-0.5 font-bold transition-all hover:gap-1 group"
                  style={{ 
                    color: "#0E4B43", 
                    fontFamily: "Manrope" 
                  }}
                >
                  See all 
                  <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="space-y-2">
                {TRANSACTIONS.slice(0, 3).map((t, index) => (
                  <div 
                    key={t.id} 
                    className={`flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/40 ${
                      index !== 0 ? '' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ 
                          background: t.type === 'credit' 
                            ? 'linear-gradient(135deg, #E6F4F0, #DCEDE7)' 
                            : 'linear-gradient(135deg, #FEF2F0, #FDE8E4)'
                        }}
                      >
                        {t.type === 'credit' ? (
                          <ArrowDownRight size={15} style={{ color: "#3F8F7F" }} />
                        ) : (
                          <ArrowUpRight size={15} style={{ color: "#E87A5A" }} />
                        )}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold" style={{ 
                          color: "#14231F", 
                          fontFamily: "Manrope" 
                        }}>
                          {t.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px]" style={{ 
                            color: "#8A9690", 
                            fontFamily: "Manrope" 
                          }}>
                            {t.date}
                          </span>
                          {t.status === 'completed' && (
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                                 style={{ background: "rgba(63, 143, 127, 0.1)" }}>
                              <CheckCircle size={8} style={{ color: "#3F8F7F" }} />
                              <span className="text-[8px] font-bold" style={{ 
                                color: "#3F8F7F", 
                                fontFamily: "Manrope" 
                              }}>
                                Done
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] font-bold" style={{ 
                      color: t.type === 'credit' ? '#3F8F7F' : '#14231F',
                      fontFamily: "Space Grotesk" 
                    }}>
                      {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats - More compact */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg"
               style={{ 
                 background: "rgba(255,255,255,0.5)",
                 backdropFilter: "blur(10px)",
                 border: "1px solid rgba(255, 255, 255, 0.3)"
               }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ 
              color: "#8A9690", 
              fontFamily: "Manrope" 
            }}>
              Total Savings
            </p>
            <p className="text-[15px] font-bold mt-0.5" style={{ 
              color: "#14231F", 
              fontFamily: "Space Grotesk" 
            }}>
              {fmt(BALANCE)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg"
               style={{ 
                 background: "rgba(255,255,255,0.5)",
                 backdropFilter: "blur(10px)",
                 border: "1px solid rgba(255, 255, 255, 0.3)"
               }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ 
              color: "#8A9690", 
              fontFamily: "Manrope" 
            }}>
              Monthly
            </p>
            <p className="text-[15px] font-bold mt-0.5" style={{ 
              color: "#14231F", 
              fontFamily: "Space Grotesk" 
            }}>
              {fmt(MONTH_SAVED)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl transition-all hover:shadow-lg"
               style={{ 
                 background: "rgba(255,255,255,0.5)",
                 backdropFilter: "blur(10px)",
                 border: "1px solid rgba(255, 255, 255, 0.3)"
               }}>
            <p className="text-[9px] uppercase tracking-wider font-bold" style={{ 
              color: "#8A9690", 
              fontFamily: "Manrope" 
            }}>
              Transactions
            </p>
            <p className="text-[15px] font-bold mt-0.5" style={{ 
              color: "#14231F", 
              fontFamily: "Space Grotesk" 
            }}>
              {MONTH_TXNS}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}