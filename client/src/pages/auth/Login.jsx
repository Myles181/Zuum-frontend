import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../contexts/AuthContexts";

const Login = () => {
  console.debug("[Login] Render start");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
  
  // useAuth now uses cookies; check isAuthenticated flag
 const { isAuthenticated, loading, error, login } = useAuth();
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    console.debug("[Login] Toggling password visibility to", !passwordVisible);
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasAttemptedLogin(true);
    console.debug("[Login] handleSubmit with", { email, password });
    const credentials = { email, password };
    await login(credentials);
    setIsSubmitting(false);
  };

useEffect(() => {
    // Only redirect if user has attempted login and is authenticated
    if (isAuthenticated && hasAttemptedLogin) {
      navigate('/home');
    }
  }, [isAuthenticated, hasAttemptedLogin, navigate]);

  useEffect(() => {
    console.debug("[Login] Scroll handler setup");
    const handleScroll = () => {
      document.querySelectorAll(".fade-in").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add("show");
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      console.debug("[Login] Cleaning up scroll handler");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.debug("[Login] Render end");

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen relative overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(18,121,155,0.95), rgba(18,101,180,0.95)), url(${a})` }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={b} alt="Logo" className="w-20 h-auto drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 fade-in">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative flex items-center">
                    <FaEnvelope className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
              <input
                type="email"
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                required
                value={email}
                onChange={(e) => {
                  console.debug("[Login] Email input:", e.target.value);
                  setEmail(e.target.value);
                }}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
              />
                  </div>
                </div>
            </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
              <input
                type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                required
                value={password}
                onChange={(e) => {
                  console.debug("[Login] Password input:", e.target.value);
                  setPassword(e.target.value);
                }}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
              />
              <button
                type="button"
                      className="absolute right-4 text-white/60 hover:text-white transition-colors duration-300 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
                  </div>
                </div>
            </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/40 rounded peer-checked:bg-[#2D8C72] peer-checked:border-[#2D8C72] transition-all duration-300 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-white/80 text-sm group-hover:text-white transition-colors duration-300">
                  Remember me
                  </span>
                </label>
                <Link 
                  to="/forgot" 
                  className="text-[#2D8C72] hover:text-[#246d59] text-sm font-medium transition-colors duration-300 hover:underline"
                >
                Forgot Password?
              </Link>
            </div>

              {/* Login Button */}
            <button
              type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#246d59] to-[#2D8C72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {loading || isSubmitting ? (
                    <>
                      <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-white/60 text-sm">or continue with</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Google Sign In */}
            <button className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group">
              <FcGoogle className="w-5 h-5 mr-3" />
              <span className="group-hover:text-white/90 transition-colors duration-300">
                Sign in with Google
              </span>
            </button>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
              Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-[#2D8C72] hover:text-[#246d59] font-semibold transition-colors duration-300 hover:underline"
                >
                Sign up
              </Link>
            </p>
              <p className="text-white/60 text-sm mt-2">
                Need to verify your account?{' '}
                <Link 
                  to="/verify" 
                  className="text-[#2D8C72] hover:text-[#246d59] font-medium transition-colors duration-300 hover:underline"
                >
                  Verify here
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default Login;