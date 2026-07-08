import React, { useState, useEffect } from "react";
import { 
  PiggyBank, 
  ArrowLeft, 
  CheckCircle2,
  Smartphone,
  Shield,
  Lock,
  Key,
  Sparkles,
  Heart,
  Activity,
  User,
  ChevronRight,
  Circle
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap');`;

const NETWORKS = {
  airtel: { 
    id: "airtel", 
    label: "Airtel Money", 
    pinLength: 4, 
    color: "#E8604C", 
    ink: "#FFFFFF", 
    tag: "AT",
    gradient: "linear-gradient(135deg, #E8604C, #D94A3D)"
  },
  mtn: { 
    id: "mtn", 
    label: "MTN Mobile Money", 
    pinLength: 5, 
    color: "#FFCC08", 
    ink: "#14231F", 
    tag: "MTN",
    gradient: "linear-gradient(135deg, #FFCC08, #F5B800)"
  },
};

// Network prefixes
const AIRTEL_PREFIXES = ["070", "074", "075", "25670", "25674", "25675"];
const MTN_PREFIXES = ["076", "077", "078", "25676", "25677", "25678"];

function digitsOnly(v) {
  return v.replace(/\D/g, "");
}

function detectNetwork(rawPhone) {
  const digits = digitsOnly(rawPhone);
  if (AIRTEL_PREFIXES.some((p) => digits.startsWith(p))) return NETWORKS.airtel;
  if (MTN_PREFIXES.some((p) => digits.startsWith(p))) return NETWORKS.mtn;
  return null;
}

function isCompletePhone(rawPhone) {
  const digits = digitsOnly(rawPhone);
  if (digits.startsWith("256")) return digits.length === 12;
  if (digits.startsWith("0")) return digits.length === 10;
  return false;
}

export default function Auth({ onLoginSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const network = detectNetwork(phone);
  const phoneComplete = isCompletePhone(phone);
  const phoneHasEnoughDigits = digitsOnly(phone).length >= 3;

  useEffect(() => {
    if (step !== "otp") return;
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  const handlePhoneContinue = async (e) => {
    e.preventDefault();
    if (!phoneComplete) {
      setError("Enter a full Ugandan phone number.");
      return;
    }
    if (!network) {
      setError("We couldn't detect MTN or Airtel from this number.");
      return;
    }
    setError("");
    setStep("pin");
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
    setError("");
    setResendIn(30);
    setStep("otp");
  };

  const handleOtpChange = (e) => {
    setOtp(digitsOnly(e.target.value).slice(0, 6));
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code sent to your phone.");
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLoginSuccess();
  };

  const back = () => {
    setError("");
    if (step === "pin") setStep("phone");
    if (step === "otp") setStep("pin");
  };

  // Step indicators
  const steps = [
    { key: "phone", label: "Phone", icon: Smartphone },
    { key: "pin", label: "PIN", icon: Lock },
    { key: "otp", label: "Verify", icon: Key }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <style>{FONT_IMPORT}</style>
      
      {/* Animated Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0B1A18 0%, #1A3A35 50%, #0E4B43 100%)" }}>
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 animate-pulse" 
             style={{ background: "radial-gradient(circle, #F5B942, transparent 70%)" }} />
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10 animate-pulse delay-1000" 
             style={{ background: "radial-gradient(circle, #3F8F7F, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5" 
             style={{ background: "radial-gradient(circle, #F5B942, transparent 60%)" }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: `rgba(245, 185, 66, ${Math.random() * 0.3 + 0.1})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative"
            style={{ 
              background: "linear-gradient(135deg, #F5B942, #E8A33D)",
              boxShadow: "0 20px 40px -12px rgba(245, 185, 66, 0.4)"
            }}
          >
            <PiggyBank size={32} color="#0E4B43" />
            <div className="absolute -top-1 -right-1">
              <Sparkles size={12} color="#FFFFFF" />
            </div>
          </div>
          <h1 
            className="text-3xl font-bold"
            style={{ 
              fontFamily: "Playfair Display, serif",
              color: "#FFFFFF"
            }}
          >
            Afya Fund
          </h1>
          <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
            Health savings from every transaction
          </p>
        </div>

        {/* Auth Card */}
        <div 
          className="rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
          style={{ 
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}
        >
          {/* Step Progress */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.key} className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      i <= currentStepIndex ? 'shadow-lg' : ''
                    }`}
                    style={{
                      background: i <= currentStepIndex 
                        ? "linear-gradient(135deg, #F5B942, #E8A33D)" 
                        : "rgba(255,255,255,0.06)",
                      border: i <= currentStepIndex 
                        ? "none" 
                        : "1px solid rgba(255,255,255,0.1)"
                    }}
                  >
                    {i < currentStepIndex ? (
                      <CheckCircle2 size={14} color="#0E4B43" />
                    ) : (
                      <s.icon size={14} color={i === currentStepIndex ? "#0E4B43" : "rgba(255,255,255,0.3)"} />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                    i === currentStepIndex ? 'text-white' : 'text-white/40'
                  }`} style={{ fontFamily: "Inter, sans-serif" }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px" style={{ background: i < currentStepIndex ? "#F5B942" : "rgba(255,255,255,0.08)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Back Button */}
          {step !== "phone" && (
            <button
              onClick={back}
              className="w-9 h-9 rounded-full flex items-center justify-center mb-4 transition-all hover:bg-white/10"
              style={{ 
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <ArrowLeft size={16} color="#FFFFFF" />
            </button>
          )}

          {/* Step 1: Phone */}
          {step === "phone" && (
            <form onSubmit={handlePhoneContinue} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                  Welcome Back
                </h2>
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Enter your mobile money number to continue
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold flex items-center gap-2"
                       style={{ fontFamily: "Inter, sans-serif" }}>
                  <Smartphone size={14} />
                  Phone Number
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX or 2567XX XXX XXX"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-white placeholder-white/40"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 14,
                      backdropFilter: "blur(10px)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#F5B942"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>

                {phoneHasEnoughDigits && (
                  <div className="mt-3 flex items-center gap-2">
                    {network ? (
                      <>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                          style={{ 
                            background: network.gradient, 
                            color: network.ink,
                            fontFamily: "Inter, sans-serif"
                          }}
                        >
                          {network.tag}
                        </div>
                        <span className="text-[12px] font-semibold" style={{ 
                          color: "#4ADE93", 
                          fontFamily: "Inter, sans-serif" 
                        }}>
                          {network.label} detected
                        </span>
                        <span className="text-[11px] text-white/40">· {network.pinLength}-digit PIN</span>
                      </>
                    ) : (
                      <span className="text-[12px] text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>
                        Keep typing to detect your network...
                      </span>
                    )}
                  </div>
                )}

                {error && (
                  <p className="mt-2 text-[11px]" style={{ color: "#F87171", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group"
                style={{
                  background: "linear-gradient(135deg, #F5B942, #E8A33D)",
                  color: "#0B1A18",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 8px 24px rgba(245, 185, 66, 0.3)"
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          )}

          {/* Step 2: PIN */}
          {step === "pin" && network && (
            <form onSubmit={handlePinContinue} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ 
                      background: network.gradient, 
                      color: network.ink,
                      fontFamily: "Inter, sans-serif"
                    }}
                  >
                    {network.tag}
                  </div>
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                    {network.label}
                  </h2>
                </div>
                <p className="text-white/60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  Enter your {network.pinLength}-digit PIN
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-white/60 font-semibold"
                         style={{ fontFamily: "Inter, sans-serif" }}>
                    PIN
                  </label>
                  <span className="text-[10px] text-white/40" style={{ fontFamily: "Inter, sans-serif" }}>
                    {pin.length}/{network.pinLength}
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder={"•".repeat(network.pinLength)}
                    autoFocus
                    maxLength={network.pinLength}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-white"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 18,
                      letterSpacing: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#F5B942"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    {[...Array(network.pinLength)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i < pin.length ? 10 : 6,
                          height: i < pin.length ? 10 : 6,
                          background: i < pin.length ? "#F5B942" : "rgba(255,255,255,0.2)",
                          transform: i < pin.length ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-[11px]" style={{ color: "#F87171", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group"
                style={{
                  background: "linear-gradient(135deg, #F5B942, #E8A33D)",
                  color: "#0B1A18",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 8px 24px rgba(245, 185, 66, 0.3)"
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          )}

          {/* Step 3: OTP */}
          {step === "otp" && network && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Playfair Display, serif" }}>
                  Verify Identity
                </h2>
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Enter the 6-digit code sent to <strong className="text-white">{phone}</strong>
                </p>
                <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  via {network.label}
                </p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold"
                       style={{ fontFamily: "Inter, sans-serif" }}>
                  Verification Code
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="••••••"
                    autoFocus
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 text-white text-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: error ? "1px solid #E8604C" : "1px solid rgba(255, 255, 255, 0.1)",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 24,
                      letterSpacing: "12px",
                      backdropFilter: "blur(10px)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#F5B942"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-[11px]" style={{ color: "#F87171", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {error}
                  </p>
                )}
              </div>

              {/* Demo Notice */}
              <div className="rounded-xl p-3.5 flex items-start gap-2.5" style={{ 
                background: "rgba(245, 185, 66, 0.08)",
                border: "1px solid rgba(245, 185, 66, 0.15)"
              }}>
                <CheckCircle2 size={16} color="#F5B942" className="shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-white/70" style={{ fontFamily: "Inter, sans-serif" }}>
                  Demo mode — enter any 6 digits to continue
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #F5B942, #E8A33D)",
                  color: "#0B1A18",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0 8px 24px rgba(245, 185, 66, 0.3)",
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0B1A18]/30 border-t-[#0B1A18] rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Verify & Login</span>
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setResendIn(30)}
                disabled={resendIn > 0}
                className="text-xs text-center w-full transition-colors"
                style={{ 
                  color: resendIn > 0 ? "rgba(255,255,255,0.3)" : "#F5B942",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  cursor: resendIn > 0 ? "not-allowed" : "pointer"
                }}
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <Shield size={14} className="text-white/30" />
              <p className="text-[10px] text-white/30" style={{ fontFamily: "Inter, sans-serif" }}>
                Secured • Encrypted • Trusted
              </p>
            </div>
            <p className="text-center mt-2 text-[10px] text-white/20" style={{ fontFamily: "Inter, sans-serif" }}>
              By continuing you agree to link your mobile money account
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.5; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.9; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.2; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}