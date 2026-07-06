import React from "react";
import { Bell, ChevronRight, TrendingUp, Wallet, Clock, User, LogOut } from "lucide-react";

/* ============================================================
   Design Tokens
   ============================================================ */
const tokens = {
  bg: "#EDE8DB",
  surface: "#FFFFFF",
  ink: "#14231F",
  inkSoft: "#5C6B64",
  inkMuted: "#8A9690",
  primary: "#0E4B43",
  primaryLight: "#DCEDE7",
  primaryDark: "#1A5C53",
  gold: "#E8A33D",
  goldLight: "#F5B942",
  coral: "#E8604C",
  line: "#E5DFD0",
  success: "#3F8F7F",
  error: "#E83A3A",
  fontHeading: "Fraunces, serif",
  fontBody: "Manrope, sans-serif",
  fontMono: "IBM Plex Mono, monospace",
};

/* ============================================================
   Utility Components
   ============================================================ */

/**
 * Card - Surface container with consistent styling
 */
export function Card({ children, className = "", style = {}, hover = false }) {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${hover ? 'hover:shadow-lg hover:translate-y-[-2px]' : ''} ${className}`}
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.line}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * SectionLabel - Section header with optional right content
 */
export function SectionLabel({ children, right, icon: Icon }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} color={tokens.primary} />}
        <p
          className="text-[11px] uppercase tracking-[0.14em] font-bold"
          style={{
            color: tokens.inkMuted,
            fontFamily: tokens.fontBody,
          }}
        >
          {children}
        </p>
      </div>
      {right && right}
    </div>
  );
}

/**
 * Badge - For notifications and status indicators
 */
export function Badge({ children, variant = "default" }) {
  const colors = {
    default: { bg: tokens.primary, text: "#FFFFFF" },
    success: { bg: tokens.success, text: "#FFFFFF" },
    error: { bg: tokens.error, text: "#FFFFFF" },
    gold: { bg: tokens.gold, text: "#FFFFFF" },
    outline: { bg: "transparent", text: tokens.primary, border: tokens.primary },
  };
  const style = colors[variant] || colors.default;

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold"
      style={{
        background: style.bg,
        color: style.text,
        border: style.border ? `1px solid ${style.border}` : "none",
        fontFamily: tokens.fontBody,
      }}
    >
      {children}
    </span>
  );
}

/**
 * PageHeader - Header with greeting and notification bell
 */
export function PageHeader({ title, greeting, unreadCount = 0, onNavigate, onLogout }) {
  const isHome = !!greeting;

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {isHome ? (
          <>
            <p
              className="text-[11px] uppercase tracking-[0.14em] flex items-center gap-2"
              style={{
                color: tokens.inkMuted,
                fontFamily: tokens.fontBody,
                fontWeight: 700,
              }}
            >
              <User size={12} />
              Welcome back
            </p>
            <h1
              className="text-[22px] md:text-[26px] leading-tight"
              style={{
                color: tokens.ink,
                fontFamily: tokens.fontHeading,
                fontWeight: 600,
              }}
            >
              {greeting}
            </h1>
          </>
        ) : (
          <h1
            className="text-[22px] md:text-[26px]"
            style={{
              color: tokens.ink,
              fontFamily: tokens.fontHeading,
              fontWeight: 600,
            }}
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 rounded-full transition-colors hover:bg-gray-100"
            style={{ background: "transparent", border: "none" }}
          >
            <LogOut size={17} color={tokens.inkMuted} />
          </button>
        )}
        <button
          onClick={() => onNavigate && onNavigate("notifications")}
          className="w-10 h-10 rounded-full flex items-center justify-center relative shrink-0 transition-all hover:shadow-md"
          style={{
            background: tokens.surface,
            border: `1px solid ${tokens.line}`,
          }}
        >
          <Bell size={17} color={tokens.ink} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse"
              style={{
                background: tokens.error,
                color: "#FFFFFF",
                fontFamily: tokens.fontBody,
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Transaction Row - Individual transaction display
 */
export function TxnRow({ t, onClick }) {
  const Icon = t.icon;
  const isCredit = t.type === "credit";
  
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 transition-all cursor-pointer hover:bg-gray-50/50"
      style={{ borderTop: `1px solid ${tokens.line}` }}
      onClick={() => onClick && onClick(t)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isCredit ? tokens.primaryLight : "#FEF2F0",
        }}
      >
        <Icon size={16} color={isCredit ? tokens.primary : tokens.coral} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] truncate font-bold"
          style={{
            color: tokens.ink,
            fontFamily: tokens.fontBody,
          }}
        >
          {t.label}
        </p>
        <div className="flex items-center gap-2">
          <p
            className="text-[11px]"
            style={{
              color: tokens.inkMuted,
              fontFamily: tokens.fontBody,
              fontWeight: 500,
            }}
          >
            {t.time}
          </p>
          {t.status && (
            <Badge variant={t.status === "completed" ? "success" : "default"}>
              {t.status}
            </Badge>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p
          className="text-[13px] font-semibold"
          style={{
            color: isCredit ? tokens.success : tokens.ink,
            fontFamily: tokens.fontMono,
          }}
        >
          {isCredit ? "+" : "-"}
          {fmtLocal(t.amount)}
        </p>
        {t.saved && (
          <p
            className="text-[11px]"
            style={{
              color: tokens.success,
              fontFamily: tokens.fontMono,
              fontWeight: 600,
            }}
          >
            +{fmtLocal(t.saved)} saved
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Stat Card - For displaying metrics
 */
export function StatCard({ label, value, subtext, icon: Icon, trend, trendValue }) {
  return (
    <div
      className="rounded-2xl p-4 transition-all hover:shadow-md"
      style={{
        background: "#F6F3EC",
        border: `1px solid ${tokens.line}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[10px] uppercase tracking-wide font-bold"
            style={{
              color: tokens.inkMuted,
              fontFamily: tokens.fontBody,
            }}
          >
            {label}
          </p>
          <p
            className="text-[16px] mt-1 font-semibold"
            style={{
              color: tokens.ink,
              fontFamily: tokens.fontMono,
            }}
          >
            {value}
          </p>
          {subtext && (
            <p
              className="text-[10.5px] mt-1"
              style={{
                color: tokens.success,
                fontFamily: tokens.fontBody,
                fontWeight: 600,
              }}
            >
              {subtext}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} color={trend > 0 ? tokens.success : tokens.coral} />
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: trend > 0 ? tokens.success : tokens.coral,
                  fontFamily: tokens.fontBody,
                }}
              >
                {trend > 0 ? "+" : ""}{trendValue}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className="p-2 rounded-xl"
            style={{
              background: `rgba(14, 75, 67, 0.08)`,
            }}
          >
            <Icon size={16} color={tokens.primary} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Pulse Ring - Circular progress with heartbeat animation
 */
export function PulseRing({ pct, balance, monthSaved, size = 210 }) {
  const r = 84;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const cx = size / 2;
  const cy = size / 2;
  
  // Heartbeat path
  const pulsePath = "M 40 105 L 62 105 L 70 82 L 82 130 L 92 60 L 100 105 L 170 105";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#EDE8DB"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={tokens.primary}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: "stroke-dashoffset 900ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Heartbeat line */}
        <path
          d={pulsePath}
          fill="none"
          stroke={tokens.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className="text-[10px] uppercase tracking-[0.14em] font-bold mb-1"
          style={{
            color: tokens.inkMuted,
            fontFamily: tokens.fontBody,
          }}
        >
          Health balance
        </p>
        <p
          className="text-[28px] leading-none font-bold"
          style={{
            color: tokens.ink,
            fontFamily: tokens.fontMono,
          }}
        >
          {fmtLocal(balance)}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: tokens.success }}
          />
          <p
            className="text-[11px] font-bold"
            style={{
              color: tokens.success,
              fontFamily: tokens.fontBody,
            }}
          >
            ↑ {fmtLocal(monthSaved)} this month
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State - For when there's no data
 */
export function EmptyState({ title, description, icon: Icon, action }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: tokens.primaryLight }}
        >
          <Icon size={32} color={tokens.primary} />
        </div>
      )}
      <h3
        className="text-lg font-semibold mb-2"
        style={{
          color: tokens.ink,
          fontFamily: tokens.fontHeading,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm"
          style={{
            color: tokens.inkMuted,
            fontFamily: tokens.fontBody,
          }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */

function fmtLocal(n) {
  return "UGX " + n.toLocaleString("en-UG");
}

/* ============================================================
   Export All
   ============================================================ */

export default {
  Card,
  SectionLabel,
  Badge,
  PageHeader,
  TxnRow,
  StatCard,
  PulseRing,
  EmptyState,
};