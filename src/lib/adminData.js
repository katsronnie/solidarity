export const fmt = (n) => "UGX " + n.toLocaleString("en-UG");

export const ADMIN_USER = { email: "admin@afyafund.ug", name: "Ops Admin" };

export const SYSTEM_STATS = {
  totalUsers: 4820,
  totalPooled: 412_680_000,
  totalTxnsThisMonth: 96_412,
  feesCollectedThisMonth: 8_940_600,
  avgBalance: 85_620,
  pendingPayouts: 7,
  activeNetworks: { mtn: 2910, airtel: 1910 },
};

export const MONTHLY_POOLED = [
  { m: "Jan", v: 61_200_000 },
  { m: "Feb", v: 68_400_000 },
  { m: "Mar", v: 74_900_000 },
  { m: "Apr", v: 81_100_000 },
  { m: "May", v: 88_300_000 },
  { m: "Jun", v: 92_780_000 },
];

export const USERS = [
  { id: 1, name: "Nakato Aisha", phone: "0772 214 xxx", network: "MTN", balance: 87420, status: "active", joined: "Feb 2026" },
  { id: 2, name: "Okello Brian", phone: "0752 118 xxx", network: "Airtel", balance: 143200, status: "active", joined: "Jan 2026" },
  { id: 3, name: "Nabirye Grace", phone: "0781 902 xxx", network: "MTN", balance: 52300, status: "active", joined: "Mar 2026" },
  { id: 4, name: "Ssemwogerere Ivan", phone: "0704 556 xxx", network: "Airtel", balance: 9800, status: "suspended", joined: "Jan 2026" },
  { id: 5, name: "Namutebi Joan", phone: "0776 330 xxx", network: "MTN", balance: 261900, status: "active", joined: "Nov 2025" },
  { id: 6, name: "Kato Emmanuel", phone: "0740 887 xxx", network: "Airtel", balance: 34500, status: "active", joined: "Apr 2026" },
];

export const ALL_TRANSACTIONS = [
  { id: 1, user: "Nakato Aisha", type: "Airtime", network: "MTN", amount: 10000, saved: 800, time: "Today, 09:14 AM" },
  { id: 2, user: "Okello Brian", type: "Send money", network: "Airtel", amount: 120000, saved: 9600, time: "Today, 09:02 AM" },
  { id: 3, user: "Nabirye Grace", type: "Data bundle", network: "MTN", amount: 15000, saved: 1200, time: "Today, 08:47 AM" },
  { id: 4, user: "Namutebi Joan", type: "Withdraw", network: "MTN", amount: 300000, saved: 24000, time: "Today, 08:20 AM" },
  { id: 5, user: "Kato Emmanuel", type: "Send money", network: "Airtel", amount: 45000, saved: 3600, time: "Yesterday, 6:55 PM" },
  { id: 6, user: "Ssemwogerere Ivan", type: "Airtime", network: "Airtel", amount: 5000, saved: 400, time: "Yesterday, 5:10 PM" },
];

export const PENDING_PAYOUTS = [
  { id: 1, user: "Nakato Aisha", type: "Hospital payment", target: "Mengo Hospital", amount: 45000, requestedAt: "10 mins ago" },
  { id: 2, user: "Okello Brian", type: "Withdrawal", target: "Medicines & prescriptions", amount: 60000, requestedAt: "42 mins ago" },
  { id: 3, user: "Namutebi Joan", type: "Hospital payment", target: "Nsambya Hospital", amount: 120000, requestedAt: "1 hr ago" },
  { id: 4, user: "Kato Emmanuel", type: "Withdrawal", target: "Verified emergency", amount: 200000, requestedAt: "3 hrs ago" },
];

/* ---------- Platform revenue: 2% fee on withdrawals & hospital bill payments ---------- */
export const SERVICE_FEE_RATE = 2;

export const TOTAL_REVENUE_BALANCE = 18_640_200;
export const REVENUE_THIS_MONTH = 2_912_400;
export const REVENUE_LAST_MONTH = 2_360_800;
export const REVENUE_TXNS_THIS_MONTH = 1_486;

export const MONTHLY_REVENUE = [
  { m: "Jan", v: 1_180_000 },
  { m: "Feb", v: 1_420_000 },
  { m: "Mar", v: 1_690_000 },
  { m: "Apr", v: 2_040_000 },
  { m: "May", v: 2_360_800 },
  { m: "Jun", v: 2_912_400 },
];

export const REVENUE_BY_TYPE = [
  { label: "Withdrawals", value: 11_120_500, color: "#3B6FE0" },
  { label: "Hospital payments", value: 7_519_700, color: "#1F9D63" },
];

export const REVENUE_BY_NETWORK = [
  { label: "MTN", value: 10_870_300, color: "#FFCC08" },
  { label: "Airtel", value: 7_769_900, color: "#E8604C" },
];