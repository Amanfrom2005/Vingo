import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useToast } from "../context/ToastContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Handle form sign up (POST)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, mobile, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      showToast("Account created successfully!", "success");
    } catch (error) {
      showToast(error?.response?.data?.message || "Sign up failed", "error");
      setLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    if (!mobile) return showToast("Mobile number is required", "error");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      showToast("Google signup successful!", "success");
    } catch (error) {
      showToast(error?.response?.data?.message || "Google auth failed", "error");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#fff9f6] to-[#ffe4df]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#eee]">
        <h1 className="text-4xl font-bold mb-2 text-[#ff4d2d] tracking-tight">
          Vingo
        </h1>
        <p className="text-gray-500 mb-8 font-medium">
          Create your account to get started with delicious food deliveries
        </p>

        {/* Form body */}
        <form onSubmit={handleSignUp}>
          <div className="mb-5">
            <label htmlFor="fullName" className="block text-gray-700 mb-1 font-semibold">
              Full Name
            </label>
            <input
              required
              id="fullName"
              type="text"
              autoComplete="name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Full Name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 mb-1 font-semibold">
              Email
            </label>
            <input
              required
              id="email"
              type="email"
              autoComplete="username"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="mobile" className="block text-gray-700 mb-1 font-semibold">
              Mobile
            </label>
            <input
              required
              id="mobile"
              type="number"
              autoComplete="tel"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
              placeholder="Enter Your Mobile Number"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 mb-1 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                required
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 border-[#eee] transition duration-300 hover:border-[#ff4d2d] bg-[#faf5f3] shadow-sm"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                className="absolute right-3 top-2/6 text-gray-600 cursor-pointer focus:outline-none focus:text-[#ff4d2d] transition-colors duration-200"
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="role" className="block text-gray-700 mb-1 font-semibold">
              Role
            </label>
            <div className="flex gap-2">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-150 border ${
                    role === r
                      ? "bg-[#ff4d2d] text-white border-[#ff4d2d] scale-105 shadow-md"
                      : "bg-white text-gray-700 border-[#eee] hover:bg-[#fff5f0]"
                  }`}
                  onClick={() => setRole(r)}
                  id={r}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-[#ff4d2d] text-white hover:bg-[#e64323] font-bold mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 shadow hover:shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader color="white" size={24} /> : "Sign Up"}
          </button>
        </form>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 font-medium transition-all duration-200 shadow-sm hover:shadow-lg"
          type="button"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#ff4d2d] hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
