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
  Award
} from "lucide-react";
import { 
  USER, BALANCE, MONTH_SAVED, MONTH_TXNS, CEILING, RATE, PCT,
  MONTHLY, TRANSACTIONS, NOTIFICATIONS, fmt 
} from "./lib/data";

// Enhanced StatCard with gradients
const StatCard = ({ label, value, subtext, icon: Icon, color, gradient }) => (
  <div 
    className="rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    style={{ 
      background: gradient || "#F6F3EC",
      border: "1px solid rgba(229, 223, 208, 0.3)"
    }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-wider" style={{ 
          color: "#8A9690", 
          fontFamily: "Manrope", 
          fontWeight: 700 
        }}>
          {label}
        </p>
        <p className="text-[18px] mt-1 font-bold" style={{ 
          color: "#14231F", 
          fontFamily: "IBM Plex Mono", 
          fontWeight: 600 
        }}>
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] mt-0.5 font-semibold" style={{ 
            color: color || "#3F8F7F", 
            fontFamily: "Manrope" 
          }}>
            {subtext}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-2 rounded-xl" style={{ 
          background: "rgba(14, 75, 67, 0.08)" 
        }}>
          <Icon size={18} style={{ color: "#0E4B43" }} />
        </div>
      )}
    </div>
  </div>
);

// Enhanced Notification Badge with pulse
const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse" 
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

// Enhanced Progress Ring with glow effect
const ProgressRing = ({ percentage, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
           style={{ background: "radial-gradient(circle, #3F8F7F, transparent 70%)" }} />
      
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#DCEDE7", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#EDE8DB", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0E4B43", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#3F8F7F", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1A5C53", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: "drop-shadow(0 0 10px rgba(63, 143, 127, 0.3))" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Sparkles size={20} style={{ color: "#F5B942", marginBottom: 4 }} />
        <p className="text-3xl font-bold" style={{ 
          color: "#14231F", 
          fontFamily: "IBM Plex Mono",
          letterSpacing: "-0.5px"
        }}>
          {fmt(BALANCE)}
        </p>
        <p className="text-[11px] font-medium mt-1" style={{ 
          color: "#8A9690", 
          fontFamily: "Manrope" 
        }}>
          of {fmt(CEILING)}
        </p>
        <div className="mt-2 px-3 py-1 rounded-full text-[10px] font-bold"
             style={{ 
               background: "rgba(63, 143, 127, 0.15)",
               color: "#3F8F7F",
               fontFamily: "Manrope"
             }}>
          {PCT}% Complete
        </div>
      </div>
    </div>
  );
};

// Enhanced Bar Chart with animations
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
                className="w-full rounded-lg transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${h}%`, 
                  background: isBest 
                    ? "linear-gradient(180deg, #F5B942, #E8A33D)" 
                    : "linear-gradient(180deg, #DCEDE7, #B8D5CC)",
                  minHeight: '4px',
                  boxShadow: isBest ? "0 4px 12px rgba(245, 185, 66, 0.3)" : "none",
                }}
              />
            </div>
            <span className="text-[10px] font-semibold" style={{ 
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

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6" style={{ background: "#EDE8DB" }}>
      {/* Enhanced Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ 
                 background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
                 boxShadow: "0 8px 24px rgba(14, 75, 67, 0.25)"
               }}>
            <User size={20} color="#FFFFFF" />
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
              <p className="text-[12px]" style={{ 
                color: "#8A9690", 
                fontFamily: "Manrope", 
                fontWeight: 500 
              }}>
                Welcome back! 👋
              </p>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3F8F7F" }} />
              <p className="text-[11px] font-semibold" style={{ 
                color: "#3F8F7F", 
                fontFamily: "Manrope" 
              }}>
                {MONTH_TXNS} transactions this month
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="relative p-2.5 rounded-2xl transition-all hover:shadow-md"
            style={{ 
              background: "#FFFFFF",
              border: "1px solid #E5DFD0"
            }}
            onClick={() => onNavigate && onNavigate("notifications")}
          >
            <Bell size={18} style={{ color: "#14231F" }} />
            <NotificationBadge count={unread} />
          </button>
          <button 
            className="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
              color: "#FFFFFF", 
              fontFamily: "Manrope",
              boxShadow: "0 4px 12px rgba(14, 75, 67, 0.2)"
            }}
            onClick={() => onNavigate && onNavigate("profile")}
          >
            Profile
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Left Column - Enhanced Balance Card */}
        <div 
          className="rounded-3xl p-8 flex flex-col items-center shadow-xl"
          style={{ 
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8F6F0 100%)", 
            border: "1px solid rgba(229, 223, 208, 0.3)",
            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
              <Wallet size={16} style={{ color: "#0E4B43" }} />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-bold" style={{ 
              color: "#8A9690", 
              fontFamily: "Manrope" 
            }}>
              Available Balance
            </span>
          </div>
          
          <ProgressRing percentage={PCT} />
          
          <div className="w-full mt-6 grid grid-cols-2 gap-3">
            <StatCard 
              label="Savings Goal" 
              value={fmt(CEILING)} 
              subtext={`${PCT}% achieved`}
              color="#3F8F7F"
              icon={Award}
              gradient="linear-gradient(135deg, #F6F3EC, #EDE8DB)"
            />
            <StatCard 
              label="Auto-Save Rate" 
              value={`${RATE}%`} 
              subtext="Per transaction"
              icon={Zap}
              gradient="linear-gradient(135deg, #F6F3EC, #EDE8DB)"
            />
          </div>

          <div className="w-full mt-5 pt-5 border-t" style={{ borderColor: "#E5DFD0" }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ 
                  color: "#8A9690", 
                  fontFamily: "Manrope", 
                  fontWeight: 700 
                }}>
                  Month saved
                </p>
                <p className="text-lg font-bold mt-0.5" style={{ 
                  color: "#14231F", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {fmt(MONTH_SAVED)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ 
                  color: "#8A9690", 
                  fontFamily: "Manrope", 
                  fontWeight: 700 
                }}>
                  Transactions
                </p>
                <p className="text-lg font-bold mt-0.5" style={{ 
                  color: "#14231F", 
                  fontFamily: "IBM Plex Mono" 
                }}>
                  {MONTH_TXNS}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Enhanced Security Banner */}
          <div 
            className="rounded-2xl px-5 py-4 flex items-start gap-3 shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #0E4B43, #1A5C53)",
              boxShadow: "0 8px 24px rgba(14, 75, 67, 0.2)"
            }}
          >
            <div className="p-2 rounded-xl" style={{ background: "rgba(245, 185, 66, 0.15)" }}>
              <Shield size={22} style={{ color: "#F5B942" }} />
            </div>
            <div>
              <p className="text-[13px] font-bold" style={{ 
                color: "#FFFFFF", 
                fontFamily: "Manrope" 
              }}>
                Health Emergency Fund Active
              </p>
              <p className="text-[11.5px] mt-0.5" style={{ 
                color: "rgba(255, 255, 255, 0.8)", 
                fontFamily: "Manrope" 
              }}>
                Protected & available for treatment or emergencies
              </p>
            </div>
          </div>

          {/* Enhanced Monthly Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
                  <TrendingUp size={16} style={{ color: "#0E4B43" }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ 
                  color: "#14231F", 
                  fontFamily: "Manrope" 
                }}>
                  Monthly Savings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold" style={{ 
                  color: "#3F8F7F", 
                  fontFamily: "Manrope" 
                }}>
                  {fmt(MONTH_SAVED)}
                </span>
                <span className="text-[11px] font-medium" style={{ 
                  color: "#8A9690", 
                  fontFamily: "Manrope" 
                }}>
                  · {MONTH_TXNS} txns
                </span>
              </div>
            </div>
            <div 
              className="rounded-2xl p-5 shadow-md"
              style={{ 
                background: "#FFFFFF", 
                border: "1px solid rgba(229, 223, 208, 0.3)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)"
              }}
            >
              <BarChart data={MONTHLY} maxValue={maxMonthly} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Transactions Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(14, 75, 67, 0.08)" }}>
              <Clock size={16} style={{ color: "#0E4B43" }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ 
              color: "#14231F", 
              fontFamily: "Manrope" 
            }}>
              Recent Transactions
            </span>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("transactions")}
            className="text-[11px] flex items-center gap-1 font-bold transition-all hover:gap-2"
            style={{ 
              color: "#0E4B43", 
              fontFamily: "Manrope" 
            }}
          >
            See all <ChevronRight size={14} />
          </button>
        </div>

        <div 
          className="rounded-2xl overflow-hidden shadow-md"
          style={{ 
            background: "#FFFFFF", 
            border: "1px solid rgba(229, 223, 208, 0.3)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)"
          }}
        >
          {TRANSACTIONS.slice(0, 3).map((t, index) => (
            <div 
              key={t.id} 
              className={`flex items-center justify-between p-4 transition-all hover:bg-gray-50/50 ${
                index !== 0 ? 'border-t' : ''
              }`}
              style={{ borderColor: "#EFEBE0" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: t.type === 'credit' 
                      ? 'linear-gradient(135deg, #E6F4F0, #DCEDE7)' 
                      : 'linear-gradient(135deg, #FEF2F0, #FDE8E4)'
                  }}
                >
                  {t.type === 'credit' ? (
                    <ArrowDownRight size={18} style={{ color: "#3F8F7F" }} />
                  ) : (
                    <ArrowUpRight size={18} style={{ color: "#E87A5A" }} />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ 
                    color: "#14231F", 
                    fontFamily: "Manrope" 
                  }}>
                    {t.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px]" style={{ 
                      color: "#8A9690", 
                      fontFamily: "Manrope" 
                    }}>
                      {t.date}
                    </span>
                    {t.status === 'completed' && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                           style={{ background: "rgba(63, 143, 127, 0.1)" }}>
                        <CheckCircle size={10} style={{ color: "#3F8F7F" }} />
                        <span className="text-[9px] font-bold" style={{ 
                          color: "#3F8F7F", 
                          fontFamily: "Manrope" 
                        }}>
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[15px] font-bold" style={{ 
                color: t.type === 'credit' ? '#3F8F7F' : '#14231F',
                fontFamily: "IBM Plex Mono" 
              }}>
                {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Footer Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-2xl transition-all hover:shadow-lg"
             style={{ 
               background: "rgba(255,255,255,0.7)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(229, 223, 208, 0.3)"
             }}>
          <p className="text-[10px] uppercase tracking-wider font-bold" style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            Total Saved
          </p>
          <p className="text-lg font-bold mt-1" style={{ 
            color: "#14231F", 
            fontFamily: "IBM Plex Mono" 
          }}>
            {fmt(BALANCE)}
          </p>
        </div>
        <div className="text-center p-4 rounded-2xl transition-all hover:shadow-lg"
             style={{ 
               background: "rgba(255,255,255,0.7)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(229, 223, 208, 0.3)"
             }}>
          <p className="text-[10px] uppercase tracking-wider font-bold" style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            This Month
          </p>
          <p className="text-lg font-bold mt-1" style={{ 
            color: "#14231F", 
            fontFamily: "IBM Plex Mono" 
          }}>
            {fmt(MONTH_SAVED)}
          </p>
        </div>
        <div className="text-center p-4 rounded-2xl transition-all hover:shadow-lg"
             style={{ 
               background: "rgba(255,255,255,0.7)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(229, 223, 208, 0.3)"
             }}>
          <p className="text-[10px] uppercase tracking-wider font-bold" style={{ 
            color: "#8A9690", 
            fontFamily: "Manrope" 
          }}>
            Transactions
          </p>
          <p className="text-lg font-bold mt-1" style={{ 
            color: "#14231F", 
            fontFamily: "IBM Plex Mono" 
          }}>
            {MONTH_TXNS}
          </p>
        </div>
      </div>
    </div>
  );
}