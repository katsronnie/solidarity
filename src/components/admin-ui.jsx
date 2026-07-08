import React from "react";

/* ============================================================
   ADMIN CONSOLE — distinct from the consumer app on purpose
   bg #F4F5F7   surface #FFFFFF   ink #101828   ink-soft #5B6472
   navy #16294D   accent #3B6FE0   success #1F9D63
   warning #E0A72E   danger #E5484D   line #E4E7EC
   Headings: Space Grotesk (vs Fraunces on the user app)
   ============================================================ */

export const ADMIN_FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`;

export function AdminCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-[16px] ${className}`}
      style={{ background: "#FFFFFF", border: "1px solid #E4E7EC", ...style }}
    >
      {children}
    </div>
  );
}

export function AdminSectionLabel({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
        {children}
      </p>
      {right}
    </div>
  );
}

export function AdminPageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-[20px] md:text-[24px]" style={{ color: "#101828", fontFamily: "Space Grotesk", fontWeight: 600 }}>
        {title}
      </p>
      {subtitle && (
        <p className="mt-1 text-[12.5px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 500 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, subColor = "#5B6472" }) {
  return (
    <AdminCard className="p-4">
      <p className="text-[10.5px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{label}</p>
      <p className="text-[19px] mt-1.5" style={{ color: "#101828", fontFamily: "Space Grotesk", fontWeight: 600 }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: subColor, fontFamily: "Manrope", fontWeight: 700 }}>{sub}</p>}
    </AdminCard>
  );
}

const BADGE_STYLES = {
  active: { bg: "#E7F6EE", color: "#1F9D63" },
  suspended: { bg: "#FDEDEE", color: "#E5484D" },
  pending: { bg: "#FFF6E4", color: "#B07C0E" },
  mtn: { bg: "#FFF6D8", color: "#8A6D00" },
  airtel: { bg: "#FDEDEE", color: "#C23B3B" },
};

export function Badge({ children, variant = "active" }) {
  const s = BADGE_STYLES[variant] || BADGE_STYLES.active;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10.5px] inline-block"
      style={{ background: s.bg, color: s.color, fontFamily: "Manrope", fontWeight: 700 }}
    >
      {children}
    </span>
  );
}

export function AdminButton({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "#16294D", color: "#FFFFFF" },
    danger: { background: "#FDEDEE", color: "#E5484D" },
    success: { background: "#E7F6EE", color: "#1F9D63" },
    ghost: { background: "#FFFFFF", color: "#101828", border: "1px solid #E4E7EC" },
  };
  return (
    <button
      {...props}
      className="px-3.5 py-2 rounded-[10px] text-[12px]"
      style={{ ...styles[variant], fontFamily: "Manrope", fontWeight: 700 }}
    >
      {children}
    </button>
  );
}

/**
 * Donut — simple SVG ring chart for revenue/allocation breakdowns.
 * segments: [{ label, value, color }]
 */
export function Donut({ segments, size = 160, centerLabel, centerValue }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  let cumulative = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const start = (cumulative / total) * 100;
          cumulative += seg.value;
          const end = (cumulative / total) * 100;
          const c = 2 * Math.PI * r;
          const dash = ((end - start) / 100) * c;
          const gap = c - dash;
          const rotate = (start / 100) * 360 - 90;
          return (
            <circle
              key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="18"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${gap + 2}`} transform={`rotate(${rotate} ${cx} ${cy})`}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <p className="text-[14px]" style={{ color: "#101828", fontFamily: "Space Grotesk", fontWeight: 600 }}>{centerValue}</p>}
          {centerLabel && <p className="text-[9px] mt-0.5 uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}