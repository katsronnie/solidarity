import React, { useState } from "react";
import { PiggyBank, Shield, Lock, Smartphone } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');`;

export default function Auth({ onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onLoginSuccess();
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7)
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7,
      10
    )}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ 
        background: "#EDE8DB",
        fontFamily: "Manrope, sans-serif"
      }}
    >
      <style>{FONT_IMPORT}</style>
      
      <div className="w-full max-w-md">
        {/* Logo and Title - Perfectly centered */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: "#0E4B43" }}
          >
            <PiggyBank size={32} color="#F5B942" />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#14231F",
              fontFamily: "Fraunces, serif",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            Afya Fund
          </h1>
          <p
            className="mt-2 text-sm font-medium"
            style={{
              color: "#8A9690",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Health savings from every transaction
          </p>
        </div>

        {/* Login Card - Perfectly centered */}
        <div
          className="rounded-2xl p-8 shadow-xl max-w-sm mx-auto"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(229, 223, 208, 0.5)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Phone Input */}
            <div>
              <label
                className="text-xs uppercase tracking-wide flex items-center gap-2 font-bold"
                style={{
                  color: "#8A9690",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                <Smartphone size={14} />
                Phone number
              </label>
              <div className="relative mt-1.5">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="07XX XXX XXX"
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                  style={{
                    border: "1px solid #E5DFD0",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 14,
                    color: "#14231F",
                    background: "#FAFAF8",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0E4B43";
                    e.target.style.boxShadow = "0 0 0 3px rgba(14, 75, 67, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5DFD0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label
                className="text-xs uppercase tracking-wide flex items-center gap-2 font-bold"
                style={{
                  color: "#8A9690",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                <Lock size={14} />
                MoMo PIN
              </label>
              <div className="relative mt-1.5">
                <input
                  type="password"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••"
                  required
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                  style={{
                    border: "1px solid #E5DFD0",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 14,
                    color: "#14231F",
                    background: "#FAFAF8",
                    letterSpacing: "8px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0E4B43";
                    e.target.style.boxShadow = "0 0 0 3px rgba(14, 75, 67, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5DFD0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {/* PIN Dots Indicator */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5"
                  style={{ pointerEvents: "none" }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                      style={{
                        background: i < pin.length ? "#0E4B43" : "#E5DFD0",
                        opacity: i < pin.length ? 1 : 0.5,
                        transform: i < pin.length ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="text-xs text-center py-2.5 px-3 rounded-lg animate-shake"
                style={{
                  color: "#B91C1C",
                  background: "#FEE2E2",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden"
              style={{
                background: isLoading ? "#1A5C53" : "#0E4B43",
                color: "#FFFFFF",
                fontFamily: "Manrope, sans-serif",
                opacity: isLoading ? 0.8 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    style={{ borderTopColor: "#FFFFFF" }}
                  />
                  <span>Processing...</span>
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Footer - Perfectly centered */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: "#E5DFD0" }}>
            <div className="flex items-center justify-center gap-2 text-xs">
              <Shield size={12} style={{ color: "#8A9690" }} />
              <p
                className="font-medium"
                style={{
                  color: "#8A9690",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Secured connection • MTN & Airtel supported
              </p>
            </div>
            <p
              className="text-center mt-3 text-[10.5px]"
              style={{
                color: "#A0AAA4",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 400,
              }}
            >
              By continuing you agree to link your mobile money account
            </p>
          </div>
        </div>

        {/* Additional spacing at bottom */}
        <div className="h-4" />
      </div>

      {/* Add shake animation for error */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}