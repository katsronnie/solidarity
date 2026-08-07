import {
  Smartphone, Send, Wifi, Stethoscope, Pill, Siren, FlaskConical,
  Bell, ShieldCheck, TrendingUp, PiggyBank,
} from "lucide-react";

export const fmt = (n) => "UGX " + n.toLocaleString("en-UG");

export const USER = { name: "Nakato Aisha", network: "MTN MoMo linked" };

export const BALANCE = 87420;
export const MONTH_SAVED = 6240;
export const MONTH_TXNS = 18;
export const CEILING = 500000;

/* ------------------------------------------------------------
   Tiered contribution formula (replaces the old flat 8% + 2%)
   ------------------------------------------------------------
   amount <= 10,000        -> flat 200
   10,000 < amount <= 50k  -> 2% of amount
   amount > 50,000         -> flat 1,000
   Then a flat UGX 20 platform fee is taken from every contribution.
   Hospital payments carry a separate 1% settlement fee charged to
   the clinic, not the user.
   ------------------------------------------------------------ */
export const CONTRIBUTION_MIN = 200;
export const CONTRIBUTION_MAX = 1000;
export const CONTRIBUTION_PCT = 2; // for the 10k-50k band
export const CONTRIBUTION_LOW_THRESHOLD = 10000;
export const CONTRIBUTION_HIGH_THRESHOLD = 50000;
export const PLATFORM_FEE = 20; // UGX, flat, per save event
export const SETTLEMENT_FEE_RATE = 1; // % of a hospital payment, charged to the clinic

export function estimateContribution(amount) {
  let gross;
  if (amount <= CONTRIBUTION_LOW_THRESHOLD) gross = CONTRIBUTION_MIN;
  else if (amount <= CONTRIBUTION_HIGH_THRESHOLD) gross = Math.round(amount * (CONTRIBUTION_PCT / 100));
  else gross = CONTRIBUTION_MAX;
  const net = Math.max(gross - PLATFORM_FEE, 0);
  return { gross, platformFee: PLATFORM_FEE, net };
}

export const SAVINGS_BY_TYPE = [
  { label: "Send money", pct: 45, color: "#0E4B43" },
  { label: "Airtime", pct: 30, color: "#E8A33D" },
  { label: "Bundles", pct: 15, color: "#6FA89A" },
  { label: "Other", pct: 10, color: "#D9D2BE" },
];

export const MONTHLY = [
  { m: "Jan", v: 4100 }, { m: "Feb", v: 4800 }, { m: "Mar", v: 5200 },
  { m: "Apr", v: 6600 }, { m: "May", v: 7200 }, { m: "Jun", v: 6240 },
];

export const ALLOCATION = [
  { label: "Consultation & checkups", value: 34968, icon: Stethoscope, color: "#0E4B43" },
  { label: "Medicines & prescriptions", value: 26226, icon: Pill, color: "#3F8F7F" },
  { label: "Emergency reserve", value: 17484, icon: Siren, color: "#E8604C" },
  { label: "Lab tests & diagnostics", value: 8742, icon: FlaskConical, color: "#E8A33D" },
];

export const TRANSACTIONS = [
  { id: 1, label: "Airtime — MTN", time: "Today, 09:14 AM", amount: 10000, saved: 180, type: "airtime", icon: Smartphone },
  { id: 2, label: "Send money — John Mukasa", time: "Today, 07:52 AM", amount: 50000, saved: 980, type: "send", icon: Send },
  { id: 3, label: "Data bundle — 1GB", time: "Yesterday, 8:30 PM", amount: 5000, saved: 180, type: "data", icon: Wifi },
  { id: 4, label: "Send money — Clinic fees", time: "Yesterday, 2:15 PM", amount: 30000, saved: 580, type: "send", icon: Send },
  { id: 5, label: "Airtime — Airtel", time: "Mon, 11:40 AM", amount: 2000, saved: 180, type: "airtime", icon: Smartphone },
];

export const NOTIFICATIONS = [
  {
    id: 1, unread: true, icon: PiggyBank, color: "#0E4B43",
    title: "UGX 980 added to your health fund",
    body: "From your send-money transaction to John Mukasa.",
    time: "Today, 07:52 AM",
  },
  {
    id: 2, unread: true, icon: TrendingUp, color: "#E8A33D",
    title: "17% of your ceiling reached",
    body: "You're UGX 412,580 away from your UGX 500,000 ceiling.",
    time: "Today, 08:00 AM",
  },
  {
    id: 3, unread: false, icon: ShieldCheck, color: "#3F8F7F",
    title: "Emergency reserve updated",
    body: "UGX 17,484 is now set aside for verified emergencies.",
    time: "Yesterday, 6:10 PM",
  },
  {
    id: 4, unread: false, icon: Bell, color: "#8A9690",
    title: "May was your best saving month",
    body: "You saved UGX 7,200 in May — 15% above your average.",
    time: "3 days ago",
  },
];

export const WITHDRAW_REASONS = [
  "Consultation & checkups",
  "Medicines & prescriptions",
  "Lab tests & diagnostics",
  "Verified emergency",
];

export const HOSPITALS = [
  { id: 1, name: "Mulago National Referral Hospital", location: "Kampala", category: "Public", verified: true },
  { id: 2, name: "Nsambya Hospital", location: "Kampala", category: "Private", verified: true },
  { id: 3, name: "Mengo Hospital", location: "Kampala", category: "Private", verified: true },
  { id: 4, name: "International Hospital Kampala (IHK)", location: "Kampala", category: "Private", verified: true },
  { id: 5, name: "Case Medical Centre", location: "Kampala", category: "Private", verified: true },
  { id: 6, name: "Rubaga Hospital", location: "Kampala", category: "Private", verified: true },
  { id: 7, name: "Naguru General Hospital", location: "Kampala", category: "Private", verified: false },
  { id: 8, name: "Jinja Regional Referral Hospital", location: "Jinja", category: "Public", verified: true },
  { id: 9, name: "Mbarara Regional Referral Hospital", location: "Mbarara", category: "Public", verified: true },
  { id: 10, name: "Gulu Regional Referral Hospital", location: "Gulu", category: "Public", verified: true },
  { id: 11, name: "Lacor Hospital", location: "Gulu", category: "Private", verified: true },
  { id: 12, name: "Kabale Regional Referral Hospital", location: "Kabale", category: "Public", verified: false },
];