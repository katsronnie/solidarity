import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Shield,
  Lock,
  Key,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');`;

const NETWORKS = {
  airtel: { id: "airtel", label: "Airtel Money", pinLength: 4, ink: "#FFFFFF", tag: "AT", gradient: "linear-gradient(135deg, #E8604C, #D94A3D)" },
  mtn: { id: "mtn", label: "MTN Mobile Money", pinLength: 5, ink: "#14231F", tag: "MTN", gradient: "linear-gradient(135deg, #FFCC08, #F5B800)" },
};

const AIRTEL_PREFIXES = ["70", "74", "75"];
const MTN_PREFIXES = ["76", "77", "78"];

function digitsOnly(v) { return v.replace(/\D/g, ""); }

function detectNetwork(localNumber) {
  if (AIRTEL_PREFIXES.some((p) => localNumber.startsWith(p))) return NETWORKS.airtel;
  if (MTN_PREFIXES.some((p) => localNumber.startsWith(p))) return NETWORKS.mtn;
  return null;
}

const isCompleteLocalNumber = (localNumber) => localNumber.length === 9;
const toE164 = (localNumber) => `+256${localNumber}`;
const toStoredPhone = (localNumber) => `256${localNumber}`;

export default function Auth({ onLoginSuccess }) {
  const [step, setStep] = useState("phone");
  const [isNewUser, setIsNewUser] = useState(false);
  const [localNumber, setLocalNumber] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const network = detectNetwork(localNumber);
  const phoneComplete = isCompleteLocalNumber(localNumber);
  const phoneHasEnoughDigits = localNumber.length >= 2;
  const displayPhone = `+256 ${localNumber}`;

  useEffect(() => {
    if (step !== "otp") return;
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  const handleLocalNumberChange = (e) => {
    setLocalNumber(digitsOnly(e.target.value).slice(0, 9));
    setError("");
  };

  const handlePhoneContinue = async (e) => {
    e.preventDefault();
    if (!phoneComplete) { setError("Enter your 9-digit number (without the leading 0)."); return; }
    if (!network) { setError("We couldn't detect MTN or Airtel from this number."); return; }

    setIsLoading(true);
    setError("");
    const e164 = toE164(localNumber);
    const storedPhone = toStoredPhone(localNumber);

    const { data: checkResult, error: checkError } = await supabase.functions.invoke(
      "check-phone-exists",
      { body: { phone: storedPhone } }
    );

    if (checkError) {
      setIsLoading(false);
      setError("Couldn't reach the server. Try again.");
      return;
    }

    if (checkResult?.exists) {
      setIsNewUser(false);
      setIsLoading(false);
      setStep("pin");
    } else {
      setIsNewUser(true);
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: e164,
        options: { shouldCreateUser: true },
      });
      setIsLoading(false);
      if (otpError) { setError(otpError.message); return; }
      setResendIn(30);
      setStep("otp");
    }
  };

  const handlePinChange = (e) => {
    setPin(digitsOnly(e.target.value).slice(0, network.pinLength));
    setError("");
  };

  const handlePinContinue = async (e) => {
    e.preventDefault();
    if (pin.length !== network.pinLength) {
      setError(`${network.label} PIN must be ${network.pinLength} digits.`);
      return;
    }

    setIsLoading(true);
    setError("");
    const e164 = toE164(localNumber);
    const storedPhone = toStoredPhone(localNumber);

    const { data: checkResult, error: checkError } = await supabase.functions.invoke(
      "check-pin-and-send-otp",
      { body: { phone: storedPhone, pin } }
    );

    if (checkError || !checkResult?.valid) {
      setIsLoading(false);
      setError(checkResult?.error || "Incorrect PIN.");
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: e164,
      options: { shouldCreateUser: false },
    });

    setIsLoading(false);
    if (otpError) { setError(otpError.message); return; }
    setResendIn(30);
    setStep("otp");
  };

  const handleOtpChange = (e) => {
    setOtp(digitsOnly(e.target.value).slice(0, 6));
    setError("");
  };

  const handleResend = async () => {
    setResendIn(30);
    await supabase.auth.signInWithOtp({
      phone: toE164(localNumber),
      options: { shouldCreateUser: isNewUser },
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter the 6-digit code sent to your phone."); return; }

    setIsLoading(true);
    setError("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: toE164(localNumber),
      token: otp,
      type: "sms",
    });

    setIsLoading(false);
    if (verifyError) { setError("That code is incorrect or expired."); return; }

    if (isNewUser) {
      setStep("details");
    } else {
      onLoginSuccess();
    }
  };

  const handleNewPinChange = (e) => setNewPin(digitsOnly(e.target.value).slice(0, network.pinLength));

  const handleFinishRegistration = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name."); return; }
    if (newPin.length !== network.pinLength) {
      setError(`${network.label} PIN must be ${network.pinLength} digits.`);
      return;
    }

    setIsLoading(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    const { data, error: fnError } = await supabase.functions.invoke("complete-registration", {
      body: { name: name.trim(), network: network.id, pin: newPin },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    setIsLoading(false);
    if (fnError || data?.error) {
      setError(data?.error || fnError.message || "Could not finish registration.");
      return;
    }

    onLoginSuccess();
  };

  const back = () => {
    setError("");
    if (step === "pin") setStep("phone");
    if (step === "otp") setStep(isNewUser ? "phone" : "pin");
    if (step === "details") setStep("otp");
  };

  const steps = isNewUser
    ? [{ key: "phone", label: "Phone", icon: Smartphone }, { key: "otp", label: "Verify", icon: Key }, { key: "details", label: "Details", icon: UserIcon }]
    : [{ key: "phone", label: "Phone", icon: Smartphone }, { key: "pin", label: "PIN", icon: Lock }, { key: "otp", label: "Verify", icon: Key }];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <style>{FONT_IMPORT}</style>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0B1A18 0%, #1A3A35 50%, #0E4B43 100%)" }}>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3F8F7F, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img
            src="/white.png"
            alt="Yumatta"
            className="mx-auto mb-4"
            style={{ maxWidth: 220, height: "auto" }}
          />
          <p className="text-white/60 text-sm mt-1">Health savings from every transaction</p>
        </div>

        <div className="rounded-3xl p-8 backdrop-blur-xl" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>

          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.key} className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ background: i <= currentStepIndex ? "linear-gradient(135deg, #F5B942, #E8A33D)" : "rgba(255,255,255,0.06)", border: i <= currentStepIndex ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                    {i < currentStepIndex ? <CheckCircle2 size={14} color="#0E4B43" /> : <s.icon size={14} color={i === currentStepIndex ? "#0E4B43" : "rgba(255,255,255,0.3)"} />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${i === currentStepIndex ? "text-white" : "text-white/40"}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px" style={{ background: i < currentStepIndex ? "#F5B942" : "rgba(255,255,255,0.08)" }} />}
              </div>
            ))}
          </div>

          {step !== "phone" && (
            <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ArrowLeft size={16} color="#FFFFFF" />
            </button>
          )}

          {step === "phone" && (
            <form onSubmit={handlePhoneContinue} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>Welcome</h2>
                <p className="text-white/60 text-sm mt-1">Enter your mobile money number to continue</p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold flex items-center gap-2"><Smartphone size={14} /> Phone Number</label>
                <div className="flex gap-2 mt-1.5">
                  <div
                    className="px-4 py-3 rounded-xl flex items-center gap-1.5 shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <span style={{ fontSize: 16 }}>🇺🇬</span>
                    <span className="text-white font-semibold" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 14 }}>+256</span>
                  </div>
                  <input
                    type="tel"
                    value={localNumber}
                    onChange={handleLocalNumberChange}
                    placeholder="712345678"
                    autoFocus
                    inputMode="numeric"
                    maxLength={9}
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl outline-none text-white placeholder-white/40"
                    style={{ background: "rgba(255, 255, 255, 0.06)", border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)", fontFamily: "IBM Plex Mono, monospace", fontSize: 14, letterSpacing: 1 }}
                  />
                </div>
                {phoneHasEnoughDigits && (
                  <div className="mt-3 flex items-center gap-2">
                    {network ? (
                      <>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: network.gradient, color: network.ink }}>{network.tag}</div>
                        <span className="text-[12px] font-semibold" style={{ color: "#4ADE93" }}>{network.label} detected</span>
                      </>
                    ) : (
                      <span className="text-[12px] text-white/40">Keep typing to detect your network...</span>
                    )}
                  </div>
                )}
                {error && <p className="mt-2 text-[11px]" style={{ color: "#F87171", fontWeight: 600 }}>{error}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full px-4 py-3.5 rounded-xl text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #F5B942, #E8A33D)", color: "#0B1A18", opacity: isLoading ? 0.8 : 1 }}>
                <div className="flex items-center justify-center gap-2">
                  <span>{isLoading ? "Checking..." : "Continue"}</span>
                  {!isLoading && <ChevronRight size={16} />}
                </div>
              </button>
            </form>
          )}

          {step === "pin" && network && (
            <form onSubmit={handlePinContinue} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: network.gradient, color: network.ink }}>{network.tag}</div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>{network.label}</h2>
                </div>
                <p className="text-white/60 text-sm">Enter your {network.pinLength}-digit PIN</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">PIN</label>
                  <span className="text-[10px] text-white/40">{pin.length}/{network.pinLength}</span>
                </div>
                <input
                  type="password" inputMode="numeric" value={pin} onChange={handlePinChange}
                  placeholder={"•".repeat(network.pinLength)} autoFocus maxLength={network.pinLength}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none text-white"
                  style={{ background: "rgba(255, 255, 255, 0.06)", border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)", fontFamily: "IBM Plex Mono, monospace", fontSize: 18, letterSpacing: "8px" }}
                />
                {error && <p className="mt-2 text-[11px]" style={{ color: "#F87171", fontWeight: 600 }}>{error}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full px-4 py-3.5 rounded-xl text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #F5B942, #E8A33D)", color: "#0B1A18", opacity: isLoading ? 0.8 : 1 }}>
                {isLoading ? "Checking PIN..." : "Continue"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>Verify your number</h2>
                <p className="text-white/60 text-sm mt-1">
                  Enter the 6-digit code sent to <strong className="text-white">{displayPhone}</strong>
                </p>
              </div>

              <input
                type="text" inputMode="numeric" value={otp} onChange={handleOtpChange}
                placeholder="••••••" autoFocus maxLength={6}
                className="w-full px-4 py-3 rounded-xl outline-none text-white text-center"
                style={{ background: "rgba(255, 255, 255, 0.06)", border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)", fontFamily: "IBM Plex Mono, monospace", fontSize: 24, letterSpacing: "12px" }}
              />
              {error && <p className="text-[11px]" style={{ color: "#F87171", fontWeight: 600 }}>{error}</p>}

              <button type="submit" disabled={isLoading} className="w-full px-4 py-3.5 rounded-xl text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #F5B942, #E8A33D)", color: "#0B1A18", opacity: isLoading ? 0.8 : 1 }}>
                {isLoading ? "Verifying..." : "Verify"}
              </button>

              <button type="button" onClick={handleResend} disabled={resendIn > 0} className="text-xs text-center w-full" style={{ color: resendIn > 0 ? "rgba(255,255,255,0.3)" : "#F5B942", fontWeight: 600 }}>
                {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
              </button>
            </form>
          )}

          {step === "details" && network && (
            <form onSubmit={handleFinishRegistration} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>Almost done</h2>
                <p className="text-white/60 text-sm mt-1">Choose your name and a PIN you'll use to log in</p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold flex items-center gap-2"><UserIcon size={14} /> Full name</label>
                <input
                  value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nakato Aisha" autoFocus
                  className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none text-white placeholder-white/40"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 14 }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-semibold flex items-center gap-2"><Lock size={14} /> Choose your {network.label} PIN</label>
                  <span className="text-[10px] text-white/40">{newPin.length}/{network.pinLength}</span>
                </div>
                <input
                  type="password" inputMode="numeric" value={newPin} onChange={handleNewPinChange}
                  placeholder={"•".repeat(network.pinLength)} maxLength={network.pinLength}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none text-white text-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: error ? "1px solid #E8604C" : "1px solid rgba(255,255,255,0.1)", fontFamily: "IBM Plex Mono, monospace", fontSize: 18, letterSpacing: "8px" }}
                />
                <p className="mt-2 text-[11px] text-white/40">You'll use this PIN every time you log in.</p>
              </div>

              {error && <p className="text-[11px]" style={{ color: "#F87171", fontWeight: 600 }}>{error}</p>}

              <button type="submit" disabled={isLoading} className="w-full px-4 py-3.5 rounded-xl text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #F5B942, #E8A33D)", color: "#0B1A18", opacity: isLoading ? 0.8 : 1 }}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <Shield size={14} className="text-white/30" />
              <p className="text-[10px] text-white/30">Secured • Encrypted • Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}