import React, { useState, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Move focus on OTP entry
  const focusInput = (i) => {
    inputsRef.current[i]?.focus();
  };

  // Handle OTP change and auto-move
  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < otp.length - 1) focusInput(idx + 1);
  };

  // Keyboard navigation for OTP
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        focusInput(idx - 1);
        const prevOtp = [...otp];
        prevOtp[idx - 1] = "";
        setOtp(prevOtp);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      focusInput(idx - 1);
    } else if (e.key === "ArrowRight" && idx < otp.length - 1) {
      focusInput(idx + 1);
    }
  };

  // Step 1: Send OTP
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      showToast("OTP sent to your email.", "success");
      setStep(2);
    } catch (err) {
      showToast(err?.response?.data?.message || "Something went wrong.", "error");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const code = otp.join("");
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp: code }, { withCredentials: true });
      showToast("OTP verified. Set your new password.", "success");
      setStep(3);
    } catch (err) {
      showToast(err?.response?.data?.message || "OTP verification failed.", "error");
    }
    setLoading(false);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword });
      showToast("Password reset! Please sign in.", "success");
      navigate("/signin");
    } catch (err) {
      showToast(err?.response?.data?.message || "Password reset failed.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff9f6] to-[#ffe4df] p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl border border-[#eee] shadow-lg animate-fadeIn">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-[#ff4d2d]">Forgot Password</h1>
            <p className="text-gray-500 mb-6">Enter your email and we'll send you an OTP.</p>
            <form onSubmit={handleForgot}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-gray-700 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  autoFocus
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] font-bold rounded-lg px-4 py-2 shadow transition duration-200 hover:shadow-lg flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? <ClipLoader color="white" size={24} /> : "Send OTP"}
              </button>
            </form>
            <div className="flex items-center justify-between mt-6">
              <Link to="/signin" className="text-sm text-[#ff4d2d] hover:underline focus:outline-none">Back to Sign In</Link>
              <span className="text-gray-400 mx-3">|</span>
              <Link to="/signup" className="text-sm text-[#ff4d2d] hover:underline focus:outline-none">Create account</Link>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-[#ff4d2d]">Verify OTP</h1>
            <p className="text-gray-500 mb-6">Enter the 6-digit OTP sent to your email.</p>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-center gap-3 mb-5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    pattern="\d"
                    className="w-12 h-12 text-center text-xl font-semibold rounded-md border focus:outline-none border-gray-300 bg-white shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-400 transition"
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    aria-label={`OTP digit ${idx + 1}`}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <button
                type="submit"
                className={`w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] font-bold rounded-lg px-4 py-2 shadow transition duration-200 hover:shadow-lg flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? <ClipLoader color="white" size={24} /> : "Verify OTP"}
              </button>
            </form>
            <button
              type="button"
              className="mt-4 underline text-sm text-[#ff4d2d]"
              onClick={async () => {
                try {
                  await axios.post(`${serverUrl}/api/auth/forgot-password`, { email }, { withCredentials: true });
                  showToast("OTP resent.", "success");
                } catch (err) {
                  showToast(err?.response?.data?.message || "Failed to resend OTP.", "error");
                }
              }}
            >
              Resend OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-[#ff4d2d]">Reset Password</h1>
            <form onSubmit={handleResetPassword}>
              <div className="mb-5">
                <label htmlFor="newPassword" className="block text-gray-700 mb-1 font-semibold">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  required
                  autoFocus
                  minLength={6}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 font-semibold">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  minLength={6}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] font-bold rounded-lg px-4 py-2 shadow transition duration-200 hover:shadow-lg flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? <ClipLoader color="white" size={24} /> : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
