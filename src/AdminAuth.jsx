import React, { useState, useEffect } from "react";
import { ShieldAlert, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ADMIN_FONT_IMPORT } from "./components/admin-ui";
import { supabase } from "./lib/supabaseClient";

export default function AdminAuth({ onLoginSuccess }) {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  const validEmail = /\S+@\S+\.\S+/.test(email);

  // Step 1: verify the password is correct, then send a real email OTP.
  // We sign out again right after the password check — the account only
  // gets a real session once the OTP is verified in step 2.
  const handleCredentials = async (e) => {
    e.preventDefault();
    if (!validEmail) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    // Password was correct — confirm this account is actually an admin
    // before going any further.
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!adminRow) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account isn't authorized for admin access.");
      return;
    }

    // Drop the session for now — real login only completes after OTP.
    await supabase.auth.signOut();

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setResendIn(30);
    setStep("otp");
  };

  const handleResend = async () => {
    setResendIn(30);
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  };

  // Step 2: verify the emailed code, which creates the real session.
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      setLoading(false);
      setError("That code is incorrect or expired.");
      return;
    }

    // Double-check admin membership again on the fresh session (belt & braces).
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id, role, name")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (!adminRow) {
      await supabase.auth.signOut();
      setError("This account isn't authorized for admin access.");
      return;
    }

    onLoginSuccess(email, adminRow.role, adminRow.name);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5" style={{ background: "#0D1526" }}>
      <style>{ADMIN_FONT_IMPORT}</style>
      <div className="w-full max-w-sm rounded-[20px] p-8" style={{ background: "#FFFFFF", border: "1px solid #E4E7EC" }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3" style={{ background: "#16294D" }}>
            <ShieldAlert size={22} color="#3B6FE0" />
          </div>
          <p style={{ color: "#101828", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 19 }}>Afya Fund Admin</p>
          <span
            className="mt-2 px-2.5 py-1 rounded-full text-[10px]"
            style={{ background: "#FDEDEE", color: "#E5484D", fontFamily: "Manrope", fontWeight: 700 }}
          >
            Authorized personnel only
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          {["credentials", "otp"].map((s, i) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full"
              style={{ background: ["credentials", "otp"].indexOf(step) >= i ? "#16294D" : "#E4E7EC" }}
            />
          ))}
        </div>

        {step === "otp" && (
          <button
            onClick={() => { setError(""); setStep("credentials"); }}
            className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#FFFFFF", border: "1px solid #E4E7EC" }}
          >
            <ArrowLeft size={16} color="#101828" />
          </button>
        )}

        {step === "credentials" ? (
          <form onSubmit={handleCredentials} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Admin email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@afyafund.ug"
                autoFocus
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                style={{ border: `1px solid ${error ? "#E5484D" : "#E4E7EC"}`, fontFamily: "Manrope", fontSize: 13.5, color: "#101828" }}
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none"
                style={{ border: `1px solid ${error ? "#E5484D" : "#E4E7EC"}`, fontFamily: "Manrope", fontSize: 13.5, color: "#101828" }}
              />
              {error && (
                <p className="mt-2 text-[11px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-4 py-3 rounded-[12px] text-[13.5px]"
              style={{ background: "#16294D", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div>
              <p style={{ color: "#101828", fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 16 }}>Verify it's you</p>
              <p className="mt-1 text-[12.5px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 500 }}>
                We sent a 6-digit code to <strong style={{ color: "#101828" }}>{email}</strong>.
              </p>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 700 }}>
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                placeholder="••••••"
                autoFocus
                maxLength={6}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-[10px] outline-none tracking-[8px] text-center"
                style={{ border: `1px solid ${error ? "#E5484D" : "#E4E7EC"}`, fontFamily: "IBM Plex Mono", fontSize: 18, color: "#101828" }}
              />
              {error && (
                <p className="mt-2 text-[11px]" style={{ color: "#E5484D", fontFamily: "Manrope", fontWeight: 600 }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 px-4 py-3 rounded-[12px] text-[13.5px]"
              style={{ background: "#16294D", color: "#FFFFFF", fontFamily: "Manrope", fontWeight: 700, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Verifying..." : "Verify & enter console"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendIn > 0}
              className="text-[11.5px] text-center"
              style={{ color: resendIn > 0 ? "#5B6472" : "#3B6FE0", fontFamily: "Manrope", fontWeight: 700 }}
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-[11px]" style={{ color: "#5B6472", fontFamily: "Manrope", fontWeight: 500 }}>
          Access is logged and restricted to authorized staff.
        </p>
      </div>
    </div>
  );
}