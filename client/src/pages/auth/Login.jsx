import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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
  // useAuth now uses cookies; check isAuthenticated flag
 const { isAuthenticated, loading, error, login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    console.debug("[Login] Toggling password visibility to", !passwordVisible);
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.debug("[Login] handleSubmit with", { email, password });
    const credentials = { email, password };
    await login(credentials);
  };

useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

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
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{ backgroundImage: `linear-gradient(rgba(18,121,155,0.89),rgba(18,101,180,0.89)), url(${a})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={email}
                onChange={(e) => {
                  console.debug("[Login] Email input:", e.target.value);
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={password}
                onChange={(e) => {
                  console.debug("[Login] Password input:", e.target.value);
                  setPassword(e.target.value);
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" className="h-5 w-5 text-[#2D8C72]" />
                <label htmlFor="rememberMe" className="ml-2 text-gray-300">
                  Remember me
                </label>
              </div>
              <Link to="/forgot" className="text-[#2D8C72] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="separator text-center my-4">
              <span className="relative px-4 text-white">or continue with</span>
            </p>

            <div className="social-login flex justify-center">
              <button className="social-button w-full mx-15 flex items-center justify-center bg-[#2D8C72] text-white py-2 px-4 rounded-lg transition duration-300">
                <FcGoogle className="w-6 h-6 mr-2" /> Google
              </button>
            </div>

            <p className="text-white text-center mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#2D8C72] hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-white text-center mt-4">
              Verify your account{' '}
              <Link to="/verify" className="text-[#2D8C72] hover:underline">
                Verify
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default Login;